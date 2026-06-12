<script lang="ts">
	import type { Effects, Effect } from '$lib/types';
	import emptyImage from '$lib/assets/empty.png';
	import Select from '$lib/components/ui/Select.svelte';
	import EffectCard from './EffectCard.svelte';

	let {
		title,
		effects,
		effectImageMap
	}: {
		title: string;
		effects: Effects;
		effectImageMap?: Record<string, string>;
	} = $props();

	type EffectSort =
		| 'default'
		| 'name: a-z'
		| 'name: z-a'
		| 'bit price: lowest to highest'
		| 'bit price: highest to lowest'
		| 'sub price: lowest to highest'
		| 'sub price: highest to lowest';

	let search = $state('');

	const effectSortOptions: Record<EffectSort, string> = {
		default: 'Default',
		'name: a-z': 'Name: A-Z',
		'name: z-a': 'Name: Z-A',
		'bit price: lowest to highest': 'Bit Price: Lowest to Highest',
		'bit price: highest to lowest': 'Bit Price: Highest to Lowest',
		'sub price: lowest to highest': 'Sub Price: Lowest to Highest',
		'sub price: highest to lowest': 'Sub Price: Highest to Lowest'
	};

	let effectSort = $state<EffectSort>('default');

	let enabledEffects = $derived.by(() => effects.filter((effect) => effect.isEnabled));

	let filteredEffects = $derived.by(() => {
		let result = enabledEffects;

		// Apply search filter
		if (search.trim()) {
			const searchTerm = search.toLowerCase().trim();
			result = result.filter((card) => {
				if (card.name.toLowerCase().includes(searchTerm)) return true;

				if (card.bitPrice && card.bitPrice.toString().startsWith(searchTerm)) return true;

				if (card.subPrice && card.subPrice.toString().startsWith(searchTerm)) return true;

				return false;
			});
		}

		// Apply sorting
		switch (effectSort) {
			case 'name: a-z':
				result = [...result].sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'name: z-a':
				result = [...result].sort((a, b) => b.name.localeCompare(a.name));
				break;
			case 'bit price: lowest to highest':
				result = [...result].sort((a, b) => a.bitPrice - b.bitPrice);
				break;
			case 'bit price: highest to lowest':
				result = [...result].sort((a, b) => b.bitPrice - a.bitPrice);
				break;
			case 'sub price: lowest to highest':
				result = [...result].sort((a, b) => (a.subPrice || 0) - (b.subPrice || 0));
				break;
			case 'sub price: highest to lowest':
				result = [...result].sort((a, b) => (b.subPrice || 0) - (a.subPrice || 0));
				break;
		}

		return result;
	});

	function getEffectImage(effect: Effect) {
		if (!effectImageMap) {
			return emptyImage;
		}

		return effectImageMap[effect.name] || emptyImage;
	}
</script>

<div class="card-list">
	<div class="header">
		<h2>{title} <span class="count">(x{filteredEffects.length})</span></h2>
		<div class="filters">
			<div class="input-container">
				<p>Search:</p>
				<input bind:value={search} type="text" placeholder="Name or Price" />
			</div>
			<div class="input-container">
				<p>Sort by:</p>
				<Select
					options={effectSortOptions}
					value={effectSort}
					handleChanged={(value) => (effectSort = value as EffectSort)}
					class="sort-select"
				/>
			</div>
		</div>
	</div>
	<div class="cards">
		{#if enabledEffects.length == 0}
			<p>No {title.toLowerCase()} enabled.</p>
		{:else if filteredEffects.length == 0}
			<p>No {title.toLowerCase()} found.</p>
		{:else}
			{#each filteredEffects as effect (effect._id)}
				<EffectCard {effect} image={getEffectImage(effect)} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.card-list {
		margin-bottom: 2em;
	}

	.header {
		margin-bottom: 1em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1em;
	}

	.count {
		font-size: 1.2rem;
		color: var(--text-muted);
		text-transform: none;
	}

	.filters {
		display: flex;
		gap: 2em;
	}

	.input-container {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	h2 {
		font-size: 1.5em;
		text-transform: uppercase;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(180px, 100%), 1fr));
		gap: 1rem;
	}

	@media only screen and (max-width: 730px) {
		.header {
			flex-direction: column;
			align-items: start;
			gap: 1em;
		}
	}

	@media only screen and (max-width: 600px) {
		.filters {
			flex-direction: column;
			gap: 1em;
		}
	}

	@media only screen and (max-width: 420px) {
		.filters,
		.input-container {
			width: 100%;
		}

		input,
		:global(.sort-select) {
			flex-grow: 1;
		}
	}
</style>
