<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { page } from "$app/stores";
import Navbar from "$lib/components/Navbar.svelte";
import { onMount } from "svelte";

export let data;
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

<Navbar {...data} />

<slot />

<div class="flowers-top"></div>
