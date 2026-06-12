<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Page } from '$lib/types';
	import { formatDistanceToNow } from 'date-fns';
	import twitchImage from '$lib/assets/twitch-64x64.png';
	import Partner from '$lib/components/icons/Partner.svelte';
	import { formatFollowers } from '$lib/utils';

	let {
		page
	}: {
		page: Page;
	} = $props();

	let followersFormatted = $derived(formatFollowers(page.followerCount));

	let now = $state(Date.now());
	const interval = setInterval(() => (now = Date.now()), 60_000);
	onDestroy(() => clearInterval(interval));

	let createdAgo = $derived.by(() => {
		if (!now || !page._creationTime) return 'never';

		const diff = now - page._creationTime;
		if (diff < 60_000) return 'just now';

		return formatDistanceToNow(page._creationTime, { addSuffix: true });
	});

	let updatedAgo = $derived.by(() => {
		if (!now || !page.updatedByOwnerAt) return 'never';

		const diff = now - page.updatedByOwnerAt;
		if (diff < 60_000) return 'just now';

		return formatDistanceToNow(page.updatedByOwnerAt, { addSuffix: true });
	});

	let expiresIn = $derived(
		now && page.expiresAt ? formatDistanceToNow(page.expiresAt, { addSuffix: true }) : 'never'
	);
</script>

<div class="page-info">
	<div class="channel-container">
		{#if page.imageUrl}
			<img src={page.imageUrl} alt="Logo" class="full-circle" />
		{:else}
			<img src={twitchImage} alt="Logo" />
		{/if}
		<h1>
			<a href="https://www.twitch.tv/{page.username}" target="_blank">
				{page.displayName}
			</a>
		</h1>
		{#if page.isPartner}
			<div class="partner-container">
				<Partner margin="0 0 0 4px" />
			</div>
		{/if}
	</div>
	<div class="other-info-container">
		<p>
			{followersFormatted}
			Followers
		</p>
		<p>Created {createdAgo}</p>
		<p>Updated {updatedAgo}</p>
		<p>Expires {expiresIn}</p>
	</div>
</div>

<style>
	.page-info {
		padding: 1em 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.channel-container {
		display: flex;
		align-items: center;
	}

	.channel-container img {
		width: 2em;
		height: 2em;
		margin-right: 0.5em;
	}

	.other-info-container {
		display: flex;
		gap: 0.75em;
	}

	.other-info-container p:not(:last-child)::after {
		content: '/';
		margin-left: 0.75em;
		color: var(--text-muted);
	}

	h1 {
		font-size: 1.8rem;
	}

	a {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.full-circle {
		border-radius: 50%;
	}

	.partner-container {
		display: flex;
		align-items: end;
	}

	@media only screen and (max-width: 1600px) {
		.page-info {
			flex-direction: column;
			justify-content: start;
			align-items: start;
			gap: 8px;
		}
	}

	@media only screen and (max-width: 750px) {
		.other-info-container {
			flex-direction: column;
		}

		.other-info-container p:not(:last-child)::after {
			display: none;
		}
	}
</style>
