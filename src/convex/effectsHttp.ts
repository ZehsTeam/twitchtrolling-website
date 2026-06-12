import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { tryParse } from './validateHttp';
import { effectInputValidator } from './schema';
import { createAPIResponse } from './utils';
import { getEditPageAuth } from './pagesHttp';

// HTTP action: PUT /page/effects?urlId=...
export const setEffects = httpAction(async (ctx, request) => {
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
		const parsed = tryParse(v.array(effectInputValidator), raw);

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

		await ctx.runMutation(internal.effects.setEffects, {
			pageId: page._id,
			data: body
		});

		return createAPIResponse(
			{
				success: true,
				data: {}
			},
			200
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Set effects failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});

// HTTP action: PATCH /page/effects?urlId=...
export const updateEffects = httpAction(async (ctx, request) => {
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
		const parsed = tryParse(v.array(effectInputValidator), raw);

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

		await ctx.runMutation(internal.effects.updateEffects, {
			pageId: page._id,
			data: body
		});

		return createAPIResponse(
			{
				success: true,
				data: {}
			},
			200
		);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Update effects failed';

		return createAPIResponse(
			{
				success: false,
				error: message
			},
			400
		);
	}
});
