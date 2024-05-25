<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { page } from "$app/stores";
import Navbar from "$lib/components/Navbar.svelte";

export let data;
</script>

<svelte:head>
	<title>v2.nezu.world</title>
	<meta
		name="theme-color"
		media="(prefers-color-scheme: light)"
		content="rgb(255, 248, 225)"
	/>
	<meta
		name="theme-color"
		media="(prefers-color-scheme: dark)"
		content="rgb(68, 51, 0)"
	/>
</svelte:head>

<Navbar {...data} />

<slot />
