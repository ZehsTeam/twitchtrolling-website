<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	const resolved = resolve('/');
</script>

<button onclick={() => goto(resolved)}>Browse pages</button>

<style>
</style>
