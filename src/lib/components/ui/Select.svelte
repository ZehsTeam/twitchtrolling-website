<script lang="ts">
	let {
		options,
		value,
		handleChanged,
		class: propsClass
	}: {
		options: Record<string, string>;
		value: string;
		handleChanged: (value: string) => void;
		class?: string;
	} = $props();
</script>

<select
	bind:value
	onchange={(e) => handleChanged((e.target as HTMLSelectElement).value)}
	class={propsClass}
>
	{#each Object.entries(options) as [optionKey, optionValue] (optionKey)}
		<option value={optionKey}>{optionValue}</option>
	{/each}
</select>

<style>
	select {
		font-family: 'Roboto', sans-serif;
	}

	select {
		padding: 0.75em 0.45em;
		border: none;
		color: var(--text);
		background: var(--bg-light);
		border: 1px solid var(--border);
		border-radius: var(--border-radius);
	}

	select:focus {
		outline: none;
	}

	select:hover {
		cursor: pointer;
	}
</style>
