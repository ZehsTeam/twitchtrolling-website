import { httpAction, type ActionCtx } from './_generated/server';
import { api, internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';
import { tryParse } from './validateHttp';
import { pageCreateValidator, pageUpdateValidator, type TwitchUserInput } from './schema';
import { toTwitchUserInput, type TwitchUser } from './twitch';
import { createAPIResponse, validateBearerTokenMultiple, type APIHelperResponse } from './utils';
import { rateLimiter } from './rateLimiter';

// HTTP action: GET /page/exists?urlId=...
export const getPageExists = httpAction(async (ctx, request) => {
	try {
		const url = new URL(request.url);
		const urlId = url.searchParams.get('urlId');

		if (!urlId) {
			return createAPIResponse(
				{
					success: false,
					error: 'urlId is missing in url search params'
				},
				400
			);
		}

		// Find page
		const page = await ctx.runQuery(api.pages.getPage, { urlId });

		if (!page) {
			return createAPIResponse(
				{
					success: false,
					error: 'Page not found'
				},
				404
			);
		}

		return createAPIResponse(
			{
				success: true,
				data: {}
			},
			200
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Check page exists failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});

// HTTP action: GET /page?urlId=...
export const getPage = httpAction(async (ctx, request) => {
	try {
		const url = new URL(request.url);
		const urlId = url.searchParams.get('urlId');

		if (!urlId) {
			return createAPIResponse(
				{
					success: false,
					error: 'urlId is missing in url search params'
				},
				400
			);
		}

		// Find page
		const page = await ctx.runQuery(api.pages.getPage, { urlId });

		if (!page) {
			return createAPIResponse(
				{
					success: false,
					error: 'Page not found'
				},
				404
			);
		}

		return createAPIResponse(
			{
				success: true,
				data: page
			},
			200
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Get page failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});

// HTTP action: POST /page
export const createPage = httpAction(async (ctx, request) => {
	try {
		// Authorization
		const createPageAuth = getCreatePageAuth(request);

		if (!createPageAuth.success) {
			return createAPIResponse(
				{
					success: false,
					error: createPageAuth.error
				},
				createPageAuth.status
			);
		}

		// Rate limiting
		const ip = (
			request.headers.get('x-forwarded-for') ??
			request.headers.get('cf-connecting-ip') ??
			'unknown'
		)
			.split(',')[0]
			.trim();

		const { ok, retryAfter } = await rateLimiter.limit(ctx, 'createPage', { key: ip });

		if (!ok) {
			return createAPIResponse({ success: false, error: 'Too many requests' }, 429);
		}

		const raw = await request.json();
		const parsed = tryParse(pageCreateValidator, raw);

		if (!parsed.ok) {
			return createAPIResponse(
				{
					success: false,
					error: parsed.error
				},
				400
			);
		}

		const body = parsed.value;

		const twitchUserResponse = await getValidTwitchUser(ctx, body.username);

		if (!twitchUserResponse.success) {
			return createAPIResponse(
				{
					success: false,
					error: twitchUserResponse.error
				},
				twitchUserResponse.status
			);
		}

		const twitchUser = twitchUserResponse.data;

		const createPageResponse = await ctx.runMutation(internal.pages.createPage, {
			data: body,
			twitchUser: twitchUser
		});

		if (!createPageResponse) {
			return createAPIResponse(
				{
					success: false,
					error: 'Internal Server Error'
				},
				500
			);
		}

		return createAPIResponse(
			{
				success: true,
				data: {
					urlId: createPageResponse.urlId,
					accessToken: createPageResponse.accessToken
				}
			},
			201
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Create page failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});

// HTTP action: PATCH /page?urlId=...
export const updatePage = httpAction(async (ctx, request) => {
	try {
		const url = new URL(request.url);
		const urlId = url.searchParams.get('urlId');

		if (!urlId) {
			return createAPIResponse(
				{
					success: false,
					error: 'urlId is missing in url search params'
				},
				400
			);
		}

		// Find page
		const page = await ctx.runQuery(internal.pages.getPageDoc, { urlId });

		if (!page) {
			return createAPIResponse(
				{
					success: false,
					error: 'Page not found'
				},
				404
			);
		}

		// Authorization
		const editPageAuth = getEditPageAuth(page, request);

		if (!editPageAuth.success) {
			return createAPIResponse(
				{
					success: false,
					error: editPageAuth.error
				},
				editPageAuth.status
			);
		}

		// Parse request body JSON
		const raw = await request.json();
		const parsed = tryParse(pageUpdateValidator, raw);

		if (!parsed.ok) {
			return createAPIResponse(
				{
					success: false,
					error: parsed.error
				},
				400
			);
		}

		const body = parsed.value;

		const newUsername = body.username;
		let changedTwitchUser = null;

		if (newUsername && newUsername.toLowerCase() !== page.username.toLowerCase()) {
			const twitchUserResponse = await getValidTwitchUser(ctx, newUsername);

			if (!twitchUserResponse.success) {
				return createAPIResponse(
					{
						success: false,
						error: twitchUserResponse.error
					},
					twitchUserResponse.status
				);
			}

			changedTwitchUser = twitchUserResponse.data;
		}

		await ctx.runMutation(internal.pages.updatePage, {
			pageId: page._id,
			data: body,
			twitchUser: changedTwitchUser ?? undefined
		});

		return createAPIResponse(
			{
				success: true,
				data: {}
			},
			200
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Update page failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});

// HTTP action: DELETE /page?urlId=...
export const deletePage = httpAction(async (ctx, request) => {
	try {
		const url = new URL(request.url);
		const urlId = url.searchParams.get('urlId');

		if (!urlId) {
			return createAPIResponse(
				{
					success: false,
					error: 'urlId is missing in url search params'
				},
				400
			);
		}

		// Find page
		const page = await ctx.runQuery(internal.pages.getPageDoc, { urlId });

		if (!page) {
			return createAPIResponse(
				{
					success: false,
					error: 'Page not found'
				},
				404
			);
		}

		// Authorization
		const editPageAuth = getEditPageAuth(page, request);

		if (!editPageAuth.success) {
			return createAPIResponse(
				{
					success: false,
					error: editPageAuth.error
				},
				editPageAuth.status
			);
		}

		await ctx.runMutation(internal.pages.deletePage, { pageId: page._id });

		return createAPIResponse(
			{
				success: true,
				data: {}
			},
			200
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Delete page failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});

export const getCreatePageAuth = (request: Request): APIHelperResponse => {
	const expectedToken = process.env.CREATE_PAGE_TOKEN!;

	if (!expectedToken) {
		console.error(`create page token is not defined`);
	}

	const adminPageToken = process.env.ADMIN_PAGE_TOKEN!;

	return validateBearerTokenMultiple(request, [expectedToken, adminPageToken]);
};

export const getEditPageAuth = (page: Doc<'pages'>, request: Request): APIHelperResponse => {
	const expectedToken = page.accessToken;

	if (!expectedToken) {
		console.error(`accessToken is not set for page: ${page._id}, username: ${page.username}`);
	}

	const adminPageToken = process.env.ADMIN_PAGE_TOKEN!;

	return validateBearerTokenMultiple(request, [expectedToken, adminPageToken]);
};

type ValidateTwitchUserResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			error: string;
	  };

const validateTwitchUser = (user: TwitchUser): ValidateTwitchUserResponse => {
	if (user.banned) {
		return { success: false, error: 'Twitch user is banned' };
	}

	if (user.login.toLowerCase() === 'CritHaxXoG'.toLowerCase()) {
		return { success: true };
	}

	if (!user.roles.isAffiliate && !user.roles.isPartner) {
		return { success: false, error: 'Twitch user is not affiliate or partner' };
	}

	if (!user.stream) {
		return { success: false, error: 'Twitch user is not live' };
	}

	const targetGame = 'R.E.P.O.';

	if (user.stream.game.displayName.toLowerCase() !== targetGame.toLowerCase()) {
		return { success: false, error: `Twitch user is not in the ${targetGame} category` };
	}

	return { success: true };
};

type ValidTwitchUserResponse =
	| {
			success: true;
			data: TwitchUserInput;
	  }
	| {
			success: false;
			error: string;
			status: number;
	  };

const getValidTwitchUser = async (
	ctx: ActionCtx,
	username: string | undefined
): Promise<ValidTwitchUserResponse> => {
	if (!username) {
		return {
			success: false,
			error: 'Username is invalid',
			status: 400
		};
	}

	const twitchUserResponse = await ctx.runAction(internal.twitch.fetchTwitchUser, { username });

	if (!twitchUserResponse.success) {
		if (twitchUserResponse.errorType == 'user-not-found') {
			return {
				success: false,
				error: 'Twitch user not found',
				status: 400
			};
		}

		return {
			success: false,
			error: 'Twitch api error',
			status: 500
		};
	}

	const twitchUser = twitchUserResponse.data;

	const validateResponse = validateTwitchUser(twitchUser);

	if (!validateResponse.success) {
		return {
			success: false,
			error: validateResponse.error,
			status: 400
		};
	}

	return {
		success: true,
		data: toTwitchUserInput(twitchUser)
	};
};
