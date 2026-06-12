<script lang="ts">
	import { onMount } from 'svelte';
	import { enemyImageMap, eventImageMap } from '$lib/imageMaps';
	import SEO from '$lib/components/SEO.svelte';
	import PageInfo from './PageInfo.svelte';
	import EffectCardList from './EffectCardList.svelte';
	import BrowsePagesButton from '$lib/components/BrowsePagesButton.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import MessageBanner from '$lib/components/MessageBanner.svelte';
	import Fa from 'svelte-fa';
	import { faHeart } from '@fortawesome/free-solid-svg-icons';
	import Bit from '$lib/components/icons/Bit.svelte';
	import Star from '$lib/components/icons/Star.svelte';
	import Gift from '$lib/components/icons/Gift.svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';

	let urlId = $state<string | undefined>(undefined);

	const pageQuery = useQuery(api.pages.getPage, () => (urlId ? { urlId } : 'skip'));
	const effectsQuery = useQuery(api.effects.getEffects, () =>
		pageQuery.data ? { pageId: pageQuery.data._id } : 'skip'
	);

	let pageData = $derived(pageQuery.data);

	let isEnemiesEnabled = $derived(
		pageData && pageData.isEnemiesEnabled && (pageData.isCheerEnabled || pageData.isSubEnabled)
	);
	let isEventsEnabled = $derived(pageData && pageData.isEventsEnabled && pageData.isCheerEnabled);

	let enemyEffects = $derived.by(() =>
		effectsQuery.data ? effectsQuery.data.filter((effect) => effect.type == 'enemy') : []
	);
	let eventEffects = $derived.by(() =>
		effectsQuery.data ? effectsQuery.data.filter((effect) => effect.type == 'event') : []
	);

	$effect(() => {
		if (pageData) {
			document.title = `${pageData.displayName} - TwitchTrolling for R.E.P.O.`;
		}
	});

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		urlId = urlParams.get('id')?.toLowerCase();
	});
</script>

<SEO
	overrides={{
		title: `Streamer's Page - TwitchTrolling for R.E.P.O.`,
		description: `See the streamer's prices and info for enabled enemies and events.`
	}}
/>

{#snippet supportBanner()}
	<p>
		This mod does not take a cut from the streamer. If you like this mod, please consider supporting
		the developer CritHaxXoG on <a href="https://ko-fi.com/zehsteam" target="_blank">Ko-fi</a>
		<Fa size="sm" icon={faHeart} />
	</p>
{/snippet}

{#if pageQuery.isLoading}
	<br />
	<h2>Loading...</h2>
{:else if pageQuery.error}
	<br />
	<h2>Failed to load page: {pageQuery.error.toString()}</h2>
	<br />
	<BrowsePagesButton />
{:else if pageData === null}
	<br />
	<h2>Page not found.</h2>
	<br />
	<BrowsePagesButton />
{:else if pageData}
	<MessageBanner id="supportBanner" content={supportBanner} />

	<div class="page-data-container">
		<PageInfo page={pageData} />

		{#if isEnemiesEnabled || isEventsEnabled}
			<div class="info-section">
				{#if isEnemiesEnabled && isEventsEnabled}
					<p>
						To spawn enemies or trigger events, simply cheer the specified amount of bits,
						subscribe, or gift subscriptions in the streamer's chat.
					</p>
				{:else if isEnemiesEnabled}
					<p>
						To spawn enemies, simply cheer the specified amount of bits, subscribe, or gift
						subscriptions in the streamer's chat.
					</p>
				{:else if isEventsEnabled}
					<p>
						To trigger events, simply cheer the specified amount of bits, subscribe, or gift
						subscriptions in the streamer's chat.
					</p>
				{/if}
				<p>100% of the bits go directly to the streamer.</p>
			</div>
			{#if pageData.isCheerEnabled || pageData.isSubEnabled}
				<div class="info-section">
					<div class="currencies-container">
						<p>Key:</p>
						{#if pageData.isCheerEnabled}
							<div class="currency-container">
								<dt><Bit yOffset="0" /></dt>
								<dd>Twitch Bit</dd>
							</div>
						{/if}
						{#if pageData.isSubEnabled}
							<div class="currency-container">
								<dt><Star yOffset="0" /></dt>
								<dd>Twitch Sub</dd>
							</div>
							<div class="currency-container">
								<dt><Gift yOffset="0" /></dt>
								<dd>Twitch Gift Sub</dd>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}

		{#if isEnemiesEnabled}
			<div class="info-section">
				<Accordion title="Sub Tier Multipliers" open={true}>
					<p>
						Using subs to spawn enemies will multiply the enemy spawn count by the tier of the sub.
					</p>
					<p>
						Tier 1 <Star yOffset="2px" /> or <Gift yOffset="2px" /> multiplies enemy spawn count by {pageData.tier1SubEnemyMultiplier}
					</p>
					<p>
						Tier 2 <Star yOffset="2px" /> or <Gift yOffset="2px" /> multiplies enemy spawn count by {pageData.tier2SubEnemyMultiplier}
					</p>
					<p>
						Tier 3 <Star yOffset="2px" /> or <Gift yOffset="2px" /> multiplies enemy spawn count by {pageData.tier3SubEnemyMultiplier}
					</p>
				</Accordion>
			</div>
		{/if}

		{#if isEnemiesEnabled && pageData.isRaidEnabled}
			<div class="info-section">
				<Accordion title="Raid Information" open={true}>
					<p>Raids from other streamers will spawn random enemies.</p>
					<p>
						Every {pageData.raidViewersPerEnemy} viewers will spawn 1 random enemy for a max of
						{pageData.raidMaxEnemySpawnCount} enemies.
					</p>
				</Accordion>
			</div>
		{/if}

		{#if isEnemiesEnabled || isEventsEnabled}
			<div class="info-section">
				<Accordion title="Additional Information">
					<p>You can edit the prices in the in-game MODS menu.</p>
					<p>This mod currently only works to spawn enemies and events from the lobby host.</p>
					<p>
						If you are playing with multiple streamers, only the host will be able to spawn enemies
						and events.
					</p>
					<p>
						If multiple enemies or events share the same prices, one will be chosen at random from
						that group.
					</p>
					<p>
						Please notify the streamer if you notice anything wrong based on the information above.
					</p>
				</Accordion>
			</div>
		{/if}

		{#if isEnemiesEnabled}
			<EffectCardList title="Enemies" effects={enemyEffects} effectImageMap={enemyImageMap} />
		{/if}

		{#if isEventsEnabled}
			<EffectCardList title="Events" effects={eventEffects} effectImageMap={eventImageMap} />
		{/if}

		{#if !isEnemiesEnabled && !isEventsEnabled}
			<p>No enemies or events enabled.</p>
		{/if}

		{#if !pageData.isHost}
			<div class="not-host-container">
				<div class="not-host-content">
					<h1>Page creator is not the host!</h1>
					<p>Only the host of the lobby is able to spawn enemies and trigger effects.</p>
					<p>This is a technical limitation of the mod right now.</p>
					<p>This may be updated in the future.</p>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.page-data-container {
		position: relative;
	}

	.not-host-container {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: start;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
	}

	.not-host-content {
		margin-top: 4em;
		position: sticky;
		top: 3rem; /* distance from top of viewport while scrolling */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem;
		background: var(--bg-light);
		border: 1px solid var(--border);
		border-radius: var(--border-radius-card);
	}

	.not-host-content h1 {
		text-transform: uppercase;
	}

	.info-section {
		margin-bottom: 1em;
	}

	.currencies-container {
		display: flex;
		gap: 0.75em;
	}

	.currency-container {
		display: flex;
		align-items: center;
	}
</style>
