<script lang="ts">
	import type { Effect } from '$lib/types';
	import Bit from '$lib/components/icons/Bit.svelte';
	import Star from '$lib/components/icons/Star.svelte';
	import Gift from '$lib/components/icons/Gift.svelte';
	import { scale } from 'svelte/transition';

	let {
		effect,
		image
	}: {
		effect: Effect;
		image: string;
	} = $props();
</script>

<div class="card" transition:scale>
	<div class="name-container">
		<p>{effect.name}</p>
		{#if effect.spawnCount}
			<p class="spawn-count">Spawns x{effect.spawnCount}</p>
		{:else}
			<p class="spawn-count">-</p>
		{/if}
	</div>
	<div class="image-container">
		<img src={image} alt="Icon" />
	</div>
	<div class="push-down"></div>
	<div class="price-container">
		<Bit />
		<p class="price">{effect.bitPrice}</p>
		{#if effect.subPrice}
			<p class="price-separator">/</p>
			{#if effect.subPrice > 1}
				<Gift />
				<p class="price">{effect.subPrice}</p>
			{:else}
				<Star />
				<p class="price">{effect.subPrice}</p>
				<p class="price-separator">/</p>
				<Gift />
				<p class="price">{effect.subPrice}</p>
			{/if}
		{/if}
	</div>
</div>

<style>
	.card {
		width: 100%;
		display: flex;
		flex-direction: column;
		background: var(--bg-light);
		border: 1px solid var(--border);
		border-radius: var(--border-radius-card);
	}

	p {
		font-size: 1.2em;
		text-transform: uppercase;
	}

	.name-container {
		margin: 0.35rem 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.spawn-count {
		font-size: 0.9em;
		color: var(--text-muted);
		text-transform: none;
	}

	.image-container {
		width: 100%;
		height: 150px;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
	}

	.push-down {
		flex-grow: 1;
	}

	.price-container {
		margin: 0.35rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.price {
		color: var(--accent-light);
	}

	.price-separator {
		margin: 0 8px;
		color: var(--text-muted);
	}
</style>
