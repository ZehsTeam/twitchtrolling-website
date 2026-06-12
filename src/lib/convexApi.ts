import { type FunctionReference, anyApi } from 'convex/server';
import { type GenericId as Id } from 'convex/values';

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
	effects: {
		getEffects: FunctionReference<'query', 'public', { pageId: Id<'pages'> }, any>;
	};
	pages: {
		getPages: FunctionReference<'query', 'public', Record<string, never>, any>;
		getPage: FunctionReference<'query', 'public', { urlId: string }, any>;
	};
};
export type InternalApiType = {};
