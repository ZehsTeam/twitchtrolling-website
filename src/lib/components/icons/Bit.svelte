<script lang="ts">
	let {
		size = '17px',
		color = 'var(--accent-light)',
		margin = '0 4px 0 0',
		yOffset = '-1.5px'
	}: {
		size?: string;
		color?: string;
		margin?: string;
		yOffset?: string;
	} = $props();
</script>

<svg
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 20 20"
	style="width: {size}; height: {size}; fill: {color}; margin: {margin}; transform: translateY({yOffset});"
	><path
		fill-rule="evenodd"
		d="m3 12 7-10 7 10-7 6-7-6zm2.678-.338L10 5.487l4.322 6.173-.85.728L10 11l-3.473 1.39-.849-.729z"
		clip-rule="evenodd"
	></path>
</svg>
