import { defineSchema, defineTable } from 'convex/server';
import { v, type Infer } from 'convex/values';

// Database
const page = {
	urlId: v.string(), // ID for accessing this page's data in the URL
	accessToken: v.string(), // Token for page creator to update this page's data.

	// Twitch Info
	username: v.string(),
	displayName: v.string(),
	imageUrl: v.string(),
	followerCount: v.number(),
	isPartner: v.boolean(),

	// Page Info
	isHost: v.boolean(),

	isEnemiesEnabled: v.boolean(),
	isEventsEnabled: v.boolean(),

	isCheerEnabled: v.boolean(),
	isSubEnabled: v.boolean(),
	isRaidEnabled: v.boolean(),

	tier1SubEnemyMultiplier: v.number(),
	tier2SubEnemyMultiplier: v.number(),
	tier3SubEnemyMultiplier: v.number(),

	raidViewersPerEnemy: v.number(),
	raidMaxEnemySpawnCount: v.number(),

	updatedByOwnerAt: v.optional(v.number()),

	expiresAt: v.number(),
	expirationJobId: v.union(v.id('_scheduled_functions'), v.null())
};

export const effectType = v.union(v.literal('enemy'), v.literal('event'));

const effect = {
	pageId: v.id('pages'),

	type: effectType,
	name: v.string(),
	isEnabled: v.boolean(),
	spawnCount: v.optional(v.number()),
	bitPrice: v.number(),
	subPrice: v.optional(v.number())
};

// API Validators
export const twitchUserInputValidator = v
	.object(page)
	.pick('displayName', 'imageUrl', 'followerCount', 'isPartner');
export type TwitchUserInput = Infer<typeof twitchUserInputValidator>;

export const effectInputValidator = v.object(effect).omit('pageId');
export type EffectInput = Infer<typeof effectInputValidator>;

export const pageCreateValidator = v.object(page).omit(
	'urlId',
	'accessToken',

	'displayName',
	'imageUrl',
	'followerCount',
	'isPartner',

	'updatedByOwnerAt',
	'expiresAt',
	'expirationJobId'
);
export type PageCreate = Infer<typeof pageCreateValidator>;

export const pageUpdateValidator = pageCreateValidator.partial();
export type PageUpdate = Infer<typeof pageUpdateValidator>;

export default defineSchema({
	pages: defineTable(page).index('by_url_id', ['urlId']),
	effects: defineTable(effect).index('by_page_id', ['pageId'])
});
