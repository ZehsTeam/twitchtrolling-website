<script lang="ts">
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faHeart } from '@fortawesome/free-solid-svg-icons';

	function openSupportPage() {
		window.open('https://ko-fi.com/zehsteam', '_blank');
	}

	const resolved = resolve('/');
</script>

<div class="header">
	<div class="left">
		<h1><a href={resolved}>TwitchTrolling</a></h1>
		<p>
			by <a href="https://solo.to/crithaxxog" target="_blank">CritHaxXoG</a> for
			<a href="https://www.twitch.tv/psychohypnotic" target="_blank">PsychoHypnotic</a>
		</p>
	</div>
	<div class="right">
		<button onclick={openSupportPage} class="support-btn">
			<p>Support</p>
			<Fa size="sm" icon={faHeart} />
		</button>
	</div>
</div>

<style>
	.header {
		padding: 1rem 20em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
		background-color: var(--accent);
		user-select: none;
	}

	.left {
		display: flex;
		flex-direction: row;
		align-items: end;
	}

	h1 {
		margin-right: 8px;
		font-size: 1.75rem;
		font-weight: 500;
	}

	h1 a {
		text-decoration: none;
	}

	.support-btn {
		display: flex;
		align-items: center;
		gap: 0.5em;
		border: 1px solid var(--text);
		border-radius: var(--border-radius-card);
	}

	.support-btn p {
		font-size: 1em;
	}

	@media only screen and (max-width: 1420px) {
		.header {
			padding: 1rem 15em;
		}
	}

	@media only screen and (max-width: 1250px) {
		.header {
			padding: 1rem 10em;
		}
	}

	@media only screen and (max-width: 960px) {
		.header {
			padding: 1rem 2em;
		}
	}

	@media only screen and (max-width: 520px) {
		.left {
			flex-direction: column;
			align-items: start;
		}
	}

	@media only screen and (max-width: 390px) {
		.header {
			flex-direction: column;
			align-items: start;
		}
	}
</style>
