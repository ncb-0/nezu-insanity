<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { navigating } from "$app/stores";
import { afterNavigate } from "$app/navigation";
import { fade } from "svelte/transition";
import Navbar from "$lib/components/Navbar.svelte";
import Loader from "$lib/components/Loader.svelte";
let { data, children } = $props();

afterNavigate(() => {
	// disableScrollHandling();
	scrollTo({ top: 0, behavior: "instant" });
});

let currentURL = $derived(data.currentURL);
</script>

<svelte:head>
	<!-- <title>nezu.world</title> -->
	<meta
		name="theme-color"
		media="(prefers-color-scheme: light)"
		content="rgb(255, 255, 255)"
	/>
	<meta
		name="theme-color"
		media="(prefers-color-scheme: dark)"
		content="rgb(39, 29, 36)"
	/>
</svelte:head>

<!-- <Navbar currentURL="/" data="" />
<Loader></Loader> -->

{#key currentURL}
	{#if $navigating}
		<Navbar currentURL="/" data="" loading="true" />
		<div>
			<Loader></Loader>
		</div>
	{:else}
		<Navbar {...data} />
		<div>
			{@render children?.()}
		</div>
		<div class="flowers-top"></div>
	{/if}
{/key}

<!-- <slot /> -->
