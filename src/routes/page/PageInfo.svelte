<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Page } from '$lib/types';
	import { format, formatDistanceToNow } from 'date-fns';
	import twitchImage from '$lib/assets/twitch-64x64.png';
	import Partner from '$lib/components/icons/Partner.svelte';
	import { formatFollowers } from '$lib/numbers';
    import * as HoverCard from "$lib/components/ui/hover-card/index.js";
    
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

    const getDateTime = (date: number | undefined): string => {
        if (!date) {
            return 'N/A';
        }

        return format(date, "d MMM yyyy, HH:mm:ss");
    }
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
        {#if followersFormatted === `${page.followerCount}`}
            <p>{followersFormatted} Followers</p>
        {:else}
            {@render infoHoverCard(`${followersFormatted} Followers`, `${page.followerCount} Followers`)}
        {/if}
        <p class="slash-separator">/</p>
        {@render infoHoverCard(`Created ${createdAgo}`, getDateTime(page._creationTime))}
        <p class="slash-separator">/</p>
        {@render infoHoverCard(`Updated ${updatedAgo}`, getDateTime(page.updatedByOwnerAt))}
        <p class="slash-separator">/</p>
        {@render infoHoverCard(`Expires ${expiresIn}`, getDateTime(page.expiresAt))}
	</div>
</div>

{#snippet infoHoverCard(text: string, hoverText: string)}
    <HoverCard.Root openDelay={0} closeDelay={0}>
        <HoverCard.Trigger>
            <p class="info-hover-card-text">{text}</p>
        </HoverCard.Trigger>
        <HoverCard.Content>
            <p>{hoverText}</p>
        </HoverCard.Content>
    </HoverCard.Root>
{/snippet}

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

    .slash-separator {
        user-select: none;
        color: var(--text-muted);
    }

    .info-hover-card-text {
        text-decoration: none !important;
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

        .slash-separator {
            display: none;
        }
	}
</style>
