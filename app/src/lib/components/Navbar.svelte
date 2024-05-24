<script>
import { goto } from "$app/navigation";
import Breadcrumb from "$lib/components/Breadcrumb.svelte";

export let currentURL;
export let data;
</script>

<nav>
	<span>
		{#if currentURL === "/"}
			nezu.world
		{:else}
			<a href="/">nezu.world</a>/<Breadcrumb />
		{/if}
	</span>
</nav>

<style>
nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	padding: 0 1ex 0;
	display: grid;
	place-content: space-between;
	gap: 1ch;
	grid-auto-flow: column;

	z-index: 9999999;
}
nav span {
	/* background: rgb(var(--bg-color)); */
	color: rgb(var(--text-color));
	/* border: 1px solid var(--text-color); */
	padding: 2px 0 0;
}
</style>
