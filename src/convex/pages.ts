import {
	internalMutation,
	internalQuery,
	query,
	type MutationCtx,
	type QueryCtx
} from './_generated/server';
import type { Id, Doc } from './_generated/dataModel';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import {
	pageCreateValidator,
	pageUpdateValidator,
	twitchUserInputValidator,
	type TwitchUserInput
} from './schema';
import { deleteEffectsHelper } from './effects';

export type PagePublic = Omit<Doc<'pages'>, 'accessToken' | 'expirationJobId'>;

export const getPages = query({
	args: {},
	handler: async (ctx, args) => {
		const pages = await ctx.db.query('pages').take(100);

		if (!pages || pages.length == 0) return [];

		return pages.map((page) => pageDocToPublic(page));
	}
});

export const getPage = query({
	args: {
		urlId: v.string()
	},
	handler: async (ctx, args) => {
		const page = await getPageByUrlId(ctx, args.urlId);
		if (!page) return null;

		return pageDocToPublic(page);
	}
});

export const getPageDoc = internalQuery({
	args: {
		urlId: v.string()
	},
	handler: async (ctx, args) => {
		return await getPageByUrlId(ctx, args.urlId);
	}
});

export const pageDocToPublic = (page: Doc<'pages'>) => {
	const { accessToken, expirationJobId, ...publicFields } = page;
	return publicFields;
};

const getPageByUrlId = async (ctx: QueryCtx, urlId: string) => {
	const page = await ctx.db
		.query('pages')
		.withIndex('by_url_id', (q) => q.eq('urlId', urlId))
		.unique();

	return page;
};

export const createPage = internalMutation({
	args: {
		data: pageCreateValidator,
		twitchUser: twitchUserInputValidator
	},
	handler: async (ctx, args) => {
		const urlId = crypto.randomUUID().replaceAll('-', '').substring(0, 8);
		const accessToken = crypto.randomUUID();

		const hours = 24; // Data expires after this many hours.
		const expiresAt = Date.now() + hours * 60 * 60 * 1000;

		const { username: rawUsername, ...data } = args.data;
		const username = rawUsername.toLowerCase();

		const pageId = await ctx.db.insert('pages', {
			urlId,
			accessToken,
			username,
			...data,
			...args.twitchUser,
			expiresAt,
			expirationJobId: null
		});

		await sendCreatePageDiscordMessage(ctx, urlId, username, args.twitchUser);

		const jobId = await ctx.scheduler.runAt(expiresAt, internal.pages.deletePageFromScheduler, {
			pageId
		});
		await ctx.db.patch(pageId, { expirationJobId: jobId });

		return { urlId, accessToken };
	}
});

export const updatePage = internalMutation({
	args: {
		pageId: v.id('pages'),
		data: pageUpdateValidator,
		twitchUser: v.optional(twitchUserInputValidator)
	},
	handler: async (ctx, args) => {
		const page = await ctx.db.get(args.pageId);
		if (!page) return null;

		const updatedByOwnerAt = Date.now();

		const { username: rawUsername, ...data } = args.data;
		const username = rawUsername?.toLowerCase();

		const fullPatch = {
			username,
			...data,
			...args.twitchUser,
			updatedByOwnerAt
		} satisfies Partial<Doc<'pages'>>;

		await ctx.db.patch(page._id, fullPatch);

		if (username && args.twitchUser) {
			await sendUpdatePageDiscordMessage(ctx, page, username, args.twitchUser);
		}
	}
});

export const deletePage = internalMutation({
	args: {
		pageId: v.id('pages')
	},
	handler: async (ctx, args) => {
		const page = await ctx.db.get(args.pageId);
		if (!page) return;

		if (page.expirationJobId) {
			await ctx.scheduler.cancel(page.expirationJobId);
		}

		await deletePageHelper(ctx, args.pageId);
	}
});

export const deletePageFromScheduler = internalMutation({
	args: {
		pageId: v.id('pages')
	},
	handler: async (ctx, args) => {
		const page = await ctx.db.get(args.pageId);
		if (!page) return;

		if (Date.now() < page.expiresAt) {
			// expiresAt was changed, reschedule for the new time
			const jobId = await ctx.scheduler.runAt(
				page.expiresAt,
				internal.pages.deletePageFromScheduler,
				{ pageId: args.pageId }
			);
			await ctx.db.patch(args.pageId, { expirationJobId: jobId });

			return;
		}

		await deletePageHelper(ctx, args.pageId);
	}
});

const deletePageHelper = async (ctx: MutationCtx, pageId: Id<'pages'>) => {
	// Delete page
	await ctx.db.delete(pageId);

	// Delete effects for page
	await deleteEffectsHelper(ctx, pageId);
};

const sendCreatePageDiscordMessage = async (
	ctx: MutationCtx,
	urlId: string,
	username: string,
	twitchUser: TwitchUserInput
) => {
	const displayName = getDisplayNameNoMarkdown(twitchUser.displayName);

	const twitchUrl = `https://www.twitch.tv/${username}`;
	const pageUrl = `https://twitchtrolling.com/page?id=${urlId}`;

	const message = `${displayName} just created a page!\n${twitchUrl}\n<${pageUrl}>`;

	await ctx.scheduler.runAfter(0, internal.discord.sendDiscordMessage, {
		message,
		mentionUser: true
	});
};

const sendUpdatePageDiscordMessage = async (
	ctx: MutationCtx,
	page: Doc<'pages'>,
	newUsername: string,
	newTwitchUser: TwitchUserInput
) => {
	const previousDisplayName = getDisplayNameNoMarkdown(page.displayName);
	const newDisplayName = getDisplayNameNoMarkdown(newTwitchUser.displayName);

	const twitchUrl = `https://www.twitch.tv/${newUsername}`;
	const pageUrl = `https://twitchtrolling.com/page?id=${page.urlId}`;

	const message = `${previousDisplayName} updated their Twitch user to ${newDisplayName}\n${twitchUrl}\n<${pageUrl}>`;

	await ctx.scheduler.runAfter(0, internal.discord.sendDiscordMessage, { message });
};

const getDisplayNameNoMarkdown = (displayName: string) => {
	return displayName.replaceAll('_', '\\_');
};
