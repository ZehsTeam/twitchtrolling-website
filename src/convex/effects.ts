import { internalMutation, query, type MutationCtx, type QueryCtx } from './_generated/server';
import type { Id, Doc } from './_generated/dataModel';
import { v } from 'convex/values';
import { effectInputValidator, type EffectInput } from './schema';

export const getEffects = query({
	args: {
		pageId: v.id('pages')
	},
	handler: async (ctx, args) => {
		const effects = await getEffectsHelper(ctx, args.pageId);
		return effects;
	}
});

export const setEffects = internalMutation({
	args: {
		pageId: v.id('pages'),
		data: v.array(effectInputValidator)
	},
	handler: async (ctx, args) => {
		const currentEffects = await getEffectsHelper(ctx, args.pageId);
		const newEffects = args.data;

		await updateOrCreateEffectsHelper(ctx, args.pageId, currentEffects, newEffects);

		// Delete current rffects that were not specified in newEffects
		await Promise.all(
			currentEffects
				.filter(
					(currentEffect) => !newEffects.find((newEffect) => effectEquals(newEffect, currentEffect))
				)
				.map((currentEffect) => ctx.db.delete(currentEffect._id))
		);

		// Update page updatedByOwnerAt field
		await ctx.db.patch(args.pageId, { updatedByOwnerAt: Date.now() });
	}
});

export const updateEffects = internalMutation({
	args: {
		pageId: v.id('pages'),
		data: v.array(effectInputValidator)
	},
	handler: async (ctx, args) => {
		const currentEffects = await getEffectsHelper(ctx, args.pageId);
		const newEffects = args.data;

		await updateOrCreateEffectsHelper(ctx, args.pageId, currentEffects, newEffects);

		// Update page updatedByOwnerAt field
		await ctx.db.patch(args.pageId, { updatedByOwnerAt: Date.now() });
	}
});

const getEffectsHelper = async (ctx: QueryCtx, pageId: Id<'pages'>) => {
	const effects = await ctx.db
		.query('effects')
		.withIndex('by_page_id', (q) => q.eq('pageId', pageId))
		.collect();

	return effects;
};

const effectEquals = (left: EffectInput, right: Doc<'effects'>) => {
	return left.type === right.type && left.name.toLowerCase() === right.name.toLowerCase();
};

const updateOrCreateEffectsHelper = async (
	ctx: MutationCtx,
	pageId: Id<'pages'>,
	currentEffects: Doc<'effects'>[],
	newEffects: EffectInput[]
) => {
	if (newEffects.length === 0) return;

	await Promise.all(
		newEffects.map(async (newEffect) => {
			const existingEffect = currentEffects.find((currentEffect) =>
				effectEquals(newEffect, currentEffect)
			);

			if (existingEffect) {
				await ctx.db.patch(existingEffect._id, newEffect);
			} else {
				await ctx.db.insert('effects', { pageId, ...newEffect });
			}
		})
	);
};

export const deleteEffectsHelper = async (ctx: MutationCtx, pageId: Id<'pages'>) => {
	const effects = await getEffectsHelper(ctx, pageId);

	await Promise.all(effects.map((effect) => ctx.db.delete(effect._id)));
};
