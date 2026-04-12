<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { enemyImageMap, eventImageMap } from '$lib/imageMaps';
	import { setPageState } from '$lib/PageState.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import PageInfo from './PageInfo.svelte';
	import CardList from './CardList.svelte';
	import Bit from '$lib/components/Bit.svelte';
	import Star from '$lib/components/Star.svelte';
	import Gift from '$lib/components/Gift.svelte';
	import BrowsePagesButton from '$lib/components/BrowsePagesButton.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import MessageBanner from '$lib/components/MessageBanner.svelte';
	import Fa from 'svelte-fa';
	import { faHeart } from '@fortawesome/free-solid-svg-icons';

	const pageState = setPageState();

	$effect(() => {
		if (pageState.state === 'loaded') {
			document.title = `${pageState.displayName} - TwitchTrolling for R.E.P.O.`;
		}
	});

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const pageId = urlParams.get('id')?.toLowerCase();

		pageState.load(pageId || '');
	});

	onDestroy(() => {
		pageState.unload();
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
		CritHaxXoG on <a href="https://ko-fi.com/zehsteam" target="_blank">Ko-fi</a>
		<Fa size="sm" icon={faHeart} />
	</p>
{/snippet}

{#if pageState.state === 'loading'}
	<br />
	<h2>Loading...</h2>
{:else if pageState.state === 'expired'}
	<br />
	<h2>This page has expired.</h2>
	<br />
	<BrowsePagesButton />
{:else if pageState.state === 'deleted'}
	<br />
	<h2>This page has been deleted.</h2>
	<br />
	<BrowsePagesButton />
{:else if pageState.state === 'failed'}
	<br />
	<h2>Failed to fetch page data.</h2>
{:else if pageState.state == 'loaded'}
	<MessageBanner id="supportBanner" content={supportBanner} />

	<PageInfo {pageState} />

	{#if pageState.enemies.length || pageState.events.length}
		<div class="info-section">
			<p>
				To spawn enemies or trigger events, simply cheer the specified amount of bits, subscribe, or
				gift subscriptions in the streamer's chat.
			</p>
			<p>100% of the bits go directly to the streamer.</p>
		</div>
		<div class="info-section">
			<div class="currencies-container">
				<p>Key:</p>
				<div class="currency-container">
					<dt><Bit yOffset="0" /></dt>
					<dd>Twitch Bit</dd>
				</div>
				<div class="currency-container">
					<dt><Star yOffset="0" /></dt>
					<dd>Twitch Sub</dd>
				</div>
				<div class="currency-container">
					<dt><Gift yOffset="0" /></dt>
					<dd>Twitch Gift Sub</dd>
				</div>
			</div>
		</div>
	{/if}

	{#if pageState.enemies.length && pageState.subEnabled && pageState.subEnemySpawnCountMultipliers}
		<div class="info-section">
			<Accordion title="Sub Tier Multipliers" open={true}>
				<p>
					Using subs to spawn enemies will multiply the enemy spawn count by the tier of the sub.
				</p>
				<p>
					Tier 1 <Star yOffset="2px" /> or <Gift yOffset="2px" /> multiplies enemy spawn count by {pageState
						.subEnemySpawnCountMultipliers.tier1}
				</p>
				<p>
					Tier 2 <Star yOffset="2px" /> or <Gift yOffset="2px" /> multiplies enemy spawn count by {pageState
						.subEnemySpawnCountMultipliers.tier2}
				</p>
				<p>
					Tier 3 <Star yOffset="2px" /> or <Gift yOffset="2px" /> multiplies enemy spawn count by {pageState
						.subEnemySpawnCountMultipliers.tier3}
				</p>
			</Accordion>
		</div>
	{/if}

	{#if pageState.enemies.length && pageState.raidEnabled && pageState.raid}
		<div class="info-section">
			<Accordion title="Raid Information" open={true}>
				<p>Raids from other streamers will spawn random enemies.</p>
				<p>
					Every {pageState.raid.viewersPerRandomEnemy} viewers will spawn 1 random enemy for a max of
					{pageState.raid.maxEnemySpawnCount} enemies.
				</p>
			</Accordion>
		</div>
	{/if}

	{#if pageState.enemies.length || pageState.events.length}
		<div class="info-section">
			<Accordion title="Additional Information">
				<p>You can edit the prices in the in-game MODS menu.</p>
				<p>This mod currently only works to spawn enemies and events from the lobby host.</p>
				<p>
					If you are playing with multiple streamers, only the host will be able to spawn enemies
					and events.
				</p>
				<p>
					If multiple enemies or events share the same prices, one will be chosen at random from that group.
				</p>
				<p>
					Please notify the streamer if you notice anything wrong based on the information above.
				</p>
			</Accordion>
		</div>
	{/if}

	{#if pageState.enemies.length}
		<CardList title="Enemies" cards={pageState.enemies} cardImageMap={enemyImageMap} />
	{/if}

	{#if pageState.events.length}
		<CardList title="Events" cards={pageState.events} cardImageMap={eventImageMap} />
	{/if}

	{#if !pageState.enemies.length && !pageState.events.length}
		<p>No enemies or events enabled.</p>
	{/if}
{:else}
	<br />
	<h2>Error 404. This page does not exist.</h2>
	<br />
	<BrowsePagesButton />
{/if}

<style>
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
