<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import PageCardList from './PageCardList.svelte';
</script>

<SEO />

<div class="info-section">
	<p>
		R.E.P.O. mod to let Twitch chat spawn monsters and trigger events with custom bit amounts and
		subs. Highly configurable, easy to use, no extension or app needed.
	</p>
	<p>
		Download the <a href="https://thunderstore.io/c/repo/p/Zehs/TwitchTrolling/" target="_blank"
			>TwitchTrolling</a
		> mod on Thunderstore.
	</p>
</div>

<PageCardList />

<style>
	.info-section {
		margin: 1em 0;
	}
</style>
