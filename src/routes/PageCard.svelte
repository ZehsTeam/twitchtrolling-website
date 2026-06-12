<script lang="ts">
	import { resolve } from '$app/paths';
	import { onDestroy } from 'svelte';
	import { formatDistanceToNow } from 'date-fns';
	import { formatFollowers } from '$lib/utils';
	import type { Page } from '$lib/types';
	import twitchImage from '$lib/assets/twitch-64x64.png';
	import Partner from '$lib/components/icons/Partner.svelte';
	import Fa from 'svelte-fa';
	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';

	let {
		page
	}: {
		page: Page;
	} = $props();

	const resolved = resolve('/page');

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

<a href="{resolved}?id={page.urlId}" transition:scale>
	<div class="page-card">
		<div class="top">
			{#if page.imageUrl}
				<img src={page.imageUrl} alt="Logo" class="full-circle" />
			{:else}
				<img src={twitchImage} alt="Logo" />
			{/if}
			<h2>{page.displayName}</h2>
			{#if page.isPartner}
				<div class="partner-container">
					<Partner margin="0 0 0 4px" />
				</div>
			{/if}
		</div>
		<div class="push-down"></div>
		<div class="bottom">
			<p>
				{followersFormatted}
				Followers
			</p>
			<p>Created {createdAgo}</p>
			<p>Updated {updatedAgo}</p>
			<p>Expires {expiresIn}</p>
		</div>

		{#if !page.isHost}
			<div class="not-host-container">
				<div class="not-host-icon-container" title="Page creator is not the host">
					<Fa size="lg" icon={faTriangleExclamation} color="red" />
				</div>
			</div>
		{/if}
	</div>
</a>

<style>
	.page-card {
		position: relative;
		height: 100%;
		padding: 0.5em;
		display: flex;
		flex-direction: column;
		background: var(--bg-light);
		border: 1px solid var(--border);
		border-radius: var(--border-radius-card);
	}

	.not-host-container {
		position: absolute;
		inset: 0;
		padding: 0.5em;
		display: flex;
		justify-content: right;
		pointer-events: none;
	}

	.not-host-icon-container {
		display: flex;
		height: fit-content;
		pointer-events: all;
	}

	img {
		width: 1.5em;
		height: 1.5em;
		margin-right: 0.5em;
	}

	a {
		text-decoration: none;
	}

	.top {
		display: flex;
		align-items: center;
	}

	.push-down {
		flex-grow: 1;
	}

	.bottom p {
		color: var(--text-muted);
	}

	.full-circle {
		border-radius: 50%;
	}

	.partner-container {
		display: flex;
		align-items: end;
	}
</style>
