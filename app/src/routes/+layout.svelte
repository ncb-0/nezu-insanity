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
	<meta property="og:title" content="nezu.world" />
	<meta
		property="og:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta
		property="description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta
		property="og:image"
		content="https://nezu.world/icon/android-chrome-512x512.png"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world/" />
	<meta property="og:site_name" content="nezu.world" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta
		property="twitter:image"
		content="https://nezu.world/icon/android-chrome-512x512.png"
	/>
	<meta property="twitter:title" content="nezu.world" />
	<meta
		property="twitter:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta property="twitter:url" content="https://nezu.world/" />
	<meta property="twitter:creator" content="@ncb0_" />
</svelte:head>

<Navbar {...data} />

<slot />

<div class="flowers-top"></div>
