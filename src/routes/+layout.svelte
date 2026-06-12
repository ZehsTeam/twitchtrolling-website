<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';

	const { children } = $props();

	setupConvex(PUBLIC_CONVEX_URL);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main>
	{@render children()}
</main>

<style>
	main {
		margin: 0 20em;
	}

	@media only screen and (max-width: 1420px) {
		main {
			margin: 0 15em;
		}
	}

	@media only screen and (max-width: 1250px) {
		main {
			margin: 0 10em;
		}
	}

	@media only screen and (max-width: 1000px) {
		main {
			margin: 0 2em;
		}
	}
</style>
