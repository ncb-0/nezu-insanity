<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { navigating } from "$app/stores";
import { fade } from "svelte/transition";
import Navbar from "$lib/components/Navbar.svelte";
import Loader from "../lib/components/Loader.svelte";
export let data;

$: currentURL = data.currentURL;
</script>

<svelte:head>
	<title>nezu.world</title>
	<meta
		name="theme-color"
		media="(prefers-color-scheme: light)"
		content="rgb(255, 255, 255)"
	/>
	<meta
		name="theme-color"
		media="(prefers-color-scheme: dark)"
		content="rgb(46, 23, 30)"
	/>
</svelte:head>

<!-- <Navbar currentURL="/" data="" />
<Loader></Loader> -->

{#key currentURL}
	{#if $navigating}
		<Navbar currentURL="/" data="" loading="true" />
		<div
			in:fade={{ duration: 100, delay: 50 }}
			out:fade={{ duration: 100, delay: 50 }}
		>
			<Loader></Loader>
		</div>
	{:else}
		<Navbar {...data} />
		<div
			in:fade={{ duration: 100, delay: 150 }}
			out:fade={{ duration: 100, delay: 0 }}
		>
			<slot />
		</div>
		<div class="flowers-top"></div>
	{/if}
{/key}

<!-- <slot /> -->
