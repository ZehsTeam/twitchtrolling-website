<script lang="ts">
	let {
		size = '17px',
		color = 'var(--accent-light)',
		margin = '0 4px 0 0',
		yOffset = '-2px'
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
	width="20"
	height="20"
	viewBox="0 0 20 20"
	aria-label="Verified Partner"
	style="width: {size}; height: {size}; fill: {color}; margin: {margin}; transform: translateY({yOffset});"
	><path
		fill-rule="evenodd"
		d="m10 2 6 2 2 6-2 6-6 2-6-2-2-6 2-6 6-2ZM8.889 13.636l5.43-5.429-1.415-1.414-4.015 4.015-2.015-2.015-1.414 1.414 3.429 3.43Z"
		clip-rule="evenodd"
		fill="#A970FF"
	></path>
</svg>
