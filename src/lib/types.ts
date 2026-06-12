import type { FunctionReturnType } from 'convex/server';
import type { api } from '$convex/_generated/api';

export type Page = NonNullable<FunctionReturnType<typeof api.pages.getPage>>;

export type Effects = FunctionReturnType<typeof api.effects.getEffects>;
export type Effect = Effects[number];
