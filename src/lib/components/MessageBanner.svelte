<script lang="ts">
	import Fa from 'svelte-fa';
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import { onMount, type Snippet } from 'svelte';
	import { PersistedState } from 'runed';

	let {
		id = 'messageBanner',
		content,
		show: showProp = true
	}: {
		id: string;
		content: Snippet;
		show?: boolean;
	} = $props();

	const closeDuration = 1000 * 60 * 60; // 60 minutes

	// persisted timestamp (ISO) or null
    // id is treated as constant for the lifetime of this component
    // svelte-ignore state_referenced_locally
	let closedAt = new PersistedState<string | null>(`${id}ClosedAt`, null);

	// a ticking value so $derived can re-evaluate over time
	let now = $state<number>(Date.now());

	// compute visibility (reacts to showProp, closedAt, and 'now')
	let show = $derived(
		showProp && (!closedAt.current || now - new Date(closedAt.current).getTime() > closeDuration)
	);

	function handleClose() {
		closedAt.current = new Date().toISOString();
	}

	onMount(() => {
		// tick every second so 'show' can flip back when time expires
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="support-banner {show ? '' : 'hidden'}">
	<div class="content">
		<div class="left">
			{@render content()}
		</div>
		<div class="right">
			<button onclick={handleClose} class="close-btn">
				<Fa size="sm" icon={faClose} />
			</button>
		</div>
	</div>
</div>

<style>
	.support-banner {
		margin-top: 1em;
		padding: 2px;
		background: linear-gradient(
			rgb(145, 70, 255) 0px,
			rgb(105, 255, 195) 61.98%,
			rgb(30, 105, 255)
		);
		border-radius: var(--border-radius-card);
	}

	.content {
		padding: 0.8em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-light);
		border-radius: var(--border-radius-card);
	}

	.close-btn {
		padding: 0;
		width: 34px;
		height: 34px;
		background: none;
	}
</style>
