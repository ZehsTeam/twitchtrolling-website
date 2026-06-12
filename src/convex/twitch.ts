import { internalAction } from './_generated/server';
import { v } from 'convex/values';
import type { TwitchUserInput } from './schema';

export interface Game {
	displayName: string;
}

export interface Stream {
	title: string;
	id: string;
	createdAt: string;
	type: string;
	viewersCount: number;
	game: Game;
}

export interface LastBroadcast {
	startedAt: string;
	title: string;
}

export interface Roles {
	isAffiliate: boolean;
	isPartner: boolean;
	isStaff: boolean | null;
}

export interface Badge {
	setID: string;
	title: string;
	description: string;
	version: string;
}

export interface ChatSettings {
	chatDelayMs: number;
	followersOnlyDurationMinutes: number | null;
	slowModeDurationSeconds: number | null;
	blockLinks: boolean;
	isSubscribersOnlyModeEnabled: boolean;
	isEmoteOnlyModeEnabled: boolean;
	isFastSubsModeEnabled: boolean;
	isUniqueChatModeEnabled: boolean;
	requireVerifiedAccount: boolean;
	rules: string[];
}

export interface Panel {
	id: string;
}

export interface TwitchUser {
	banned: boolean;
	displayName: string;
	login: string;
	id: string;
	bio: string;
	follows: number | null;
	followers: number;
	profileViewCount: number | null;
	chatColor: string;
	logo: string;
	banner: string | null;
	verifiedBot: boolean | null;
	createdAt: string;
	updatedAt: string;
	emotePrefix: string;
	roles: Roles;
	badges: Badge[];
	chatterCount: number;
	chatSettings: ChatSettings;
	stream: Stream | null;
	lastBroadcast: LastBroadcast;
	panels: Panel[];
}

export type TwitchUserList = TwitchUser[];

export type ErrorType = 'api-response-error' | 'user-not-found';

export type TwitchUserResponse =
	| {
			success: true;
			data: TwitchUser;
	  }
	| {
			success: false;
			errorType: ErrorType;
	  };

export async function fetchTwitchUserFromAPI(username: string): Promise<TwitchUserResponse> {
	const res = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`, {
		method: 'GET'
	});

	if (!res.ok) {
		return {
			success: false,
			errorType: 'api-response-error'
		};
	}

	const json = (await res.json()) as TwitchUserList;

	if (json.length == 0) {
		return {
			success: false,
			errorType: 'user-not-found'
		};
	}

	return {
		success: true,
		data: json[0]
	};
}

export const fetchTwitchUser = internalAction({
	args: {
		username: v.string()
	},
	handler: async (ctx, args) => {
		const response = await fetchTwitchUserFromAPI(args.username);
		return response;
	}
});

export const toTwitchUserInput = (user: TwitchUser): TwitchUserInput => {
	return {
		displayName: user.displayName,
		imageUrl: user.logo,
		followerCount: user.followers,
		isPartner: user.roles.isPartner
	};
};
