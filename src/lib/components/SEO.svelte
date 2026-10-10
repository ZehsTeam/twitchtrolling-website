<script lang="ts">
	let {
		overrides
	}: {
		overrides?: Partial<SEOData>;
	} = $props();

	export type SEOData = {
		title: string;
		description: string;
		image: string;
		url: string;
	};

	const author = 'CritHaxXoG / Zehs';
	const twitterHandle = '@ZehsStudios';

	const defaults: SEOData = {
		title: 'TwitchTrolling for R.E.P.O.',
		description:
			'R.E.P.O. mod to let Twitch chat spawn monsters and trigger events with custom bit amounts and subs. Highly configurable, easy to use, no extension or app needed.',
		image: '/icon.png',
		url: 'https://twitchtrolling.com'
	};
    
    // svelte-ignore state_referenced_locally
	const seo: SEOData = {
		...defaults,
		...overrides
	};
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta
		name="keywords"
		content="twitch, trolling, fun, streaming, interaction, interactions, twitch trolling, twitch trolling prices, twitch trolling enemies, twitch trolling events"
	/>
	<meta name="author" content={author} />
	<meta name="theme-color" content="#9146ff" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="TwitchTrolling" />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.url + seo.image} />
	<meta property="og:url" content={seo.url} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.url + seo.image} />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
</svelte:head>
