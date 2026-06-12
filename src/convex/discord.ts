import { internalAction } from './_generated/server';
import { v } from 'convex/values';

export const sendDiscordMessage = internalAction({
	args: {
		message: v.string(),
		mentionUser: v.optional(v.boolean())
	},
	handler: async (_ctx, args) => {
		const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
		if (!webhookUrl) {
			console.warn('DISCORD_WEBHOOK_URL is not set');
			return;
		}

		let content = args.message;

		let allowedMentions: {
			users?: string[];
		} = {};

		const userId = process.env.DISCORD_MENTION_USER_ID;

		if (args.mentionUser && userId) {
			content = `<@${userId}> ${args.message}`;

			allowedMentions = { users: [userId] };
		}

		try {
			const response = await fetch(webhookUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, allowed_mentions: allowedMentions })
			});

			if (!response.ok) {
				console.error(`Discord webhook failed: ${response.status}`);
			}
		} catch (error) {
			console.error('Failed to send Discord message:', error);
		}
	}
});
