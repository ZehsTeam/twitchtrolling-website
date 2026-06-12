<script lang="ts">
	import PageCard from './PageCard.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';

	const pages = useQuery(api.pages.getPages, {});

	let pagesData = $derived(pages.data || []);

	let search = $state('');

	type PageSort =
		| 'default'
		| 'created: newest to oldest'
		| 'created: oldest to newest'
		| 'updated: newest to oldest'
		| 'updated: oldest to newest'
		| 'expires: latest to soonest'
		| 'expires: soonest to latest';

	const pageSortOptions: Record<PageSort, string> = {
		default: 'Default',
		'created: newest to oldest': 'Created: Newest to Oldest',
		'created: oldest to newest': 'Created: Oldest to Newest',
		'updated: newest to oldest': 'Updated: Newest to Oldest',
		'updated: oldest to newest': 'Updated: Oldest to Newest',
		'expires: latest to soonest': 'Expires: Latest to Soonest',
		'expires: soonest to latest': 'Expires: Soonest to Latest'
	};

	let pageSort = $state<PageSort>('created: newest to oldest');

	let filteredPages = $derived.by(() => {
		let result = pagesData;

		// Apply search filter
		if (search.trim()) {
			const searchTerm = search.toLowerCase().trim();

			result = result.filter((page) => {
				if (page.username.toLowerCase().includes(searchTerm)) return true;

				if (page.displayName.toLowerCase().includes(searchTerm)) return true;

				return false;
			});
		}

		// Apply sorting
		switch (pageSort) {
			case 'created: newest to oldest':
				result = [...result].sort(
					(a, b) => new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime()
				);
				break;
			case 'created: oldest to newest':
				result = [...result].sort(
					(a, b) => new Date(a._creationTime).getTime() - new Date(b._creationTime).getTime()
				);
				break;
			case 'updated: newest to oldest':
				result = [...result].sort((a, b) => {
					// Handle null values - treat them as earliest possible date
					const aTime = a.updatedByOwnerAt ? new Date(a.updatedByOwnerAt).getTime() : 0;
					const bTime = b.updatedByOwnerAt ? new Date(b.updatedByOwnerAt).getTime() : 0;
					return bTime - aTime;
				});
				break;
			case 'updated: oldest to newest':
				result = [...result].sort((a, b) => {
					// Handle null values - treat them as earliest possible date
					const aTime = a.updatedByOwnerAt ? new Date(a.updatedByOwnerAt).getTime() : 0;
					const bTime = b.updatedByOwnerAt ? new Date(b.updatedByOwnerAt).getTime() : 0;
					return aTime - bTime;
				});
				break;
			case 'expires: latest to soonest':
				result = [...result].sort(
					(a, b) => new Date(b.expiresAt || 0).getTime() - new Date(a.expiresAt || 0).getTime()
				);
				break;
			case 'expires: soonest to latest':
				result = [...result].sort(
					(a, b) => new Date(a.expiresAt || 0).getTime() - new Date(b.expiresAt || 0).getTime()
				);
				break;
		}

		return result;
	});
</script>

<div class="page-card-list">
	<div class="header">
		<h2>Pages <span class="count">(x{filteredPages.length})</span></h2>
		<div class="filters">
			<div class="input-container">
				<p>Search:</p>
				<input bind:value={search} type="text" placeholder="Name" />
			</div>
			<div class="input-container">
				<p>Sort by:</p>
				<Select
					options={pageSortOptions}
					value={pageSort}
					handleChanged={(value) => (pageSort = value as PageSort)}
					class="sort-select"
				/>
			</div>
		</div>
	</div>

	{#if pages.isLoading}
		<p>Loading...</p>
	{:else if pages.error}
		<p>Failed to load: {pages.error.toString()}</p>
	{:else if pages.data.length == 0}
		<p>No pages found.</p>
	{:else}
		<div class="cards">
			{#each filteredPages as page (page._id)}
				<PageCard {page} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-card-list {
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
		grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
		gap: 1rem;
	}

	@media only screen and (max-width: 730px) {
		.header {
			flex-direction: column;
			align-items: start;
			gap: 1em;
		}
	}

	@media only screen and (max-width: 640px) {
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
