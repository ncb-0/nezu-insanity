<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { page } from "$app/stores";
import Navbar from "$lib/components/Navbar.svelte";
import { enableVisualEditing } from "@sanity/visual-editing";
import { useLiveMode } from "@sanity/svelte-loader";
import { client } from "$lib/sanity/client";
import { PUBLIC_SANITY_STUDIO_URL } from "$env/static/public";
import { onMount } from "svelte";
console.log(PUBLIC_SANITY_STUDIO_URL);
export let data;

onMount(() => enableVisualEditing());

onMount(() =>
	useLiveMode({
		// If `stega.studioUrl` was not provided to the client instance in `sanity.ts`, a studioUrl should be provided here
		studioUrl: PUBLIC_SANITY_STUDIO_URL,
		// ...or alternatively provide the stega client directly
		// client: client.withConfig({
		//   stega: true
		// })
	})
);
</script>

<svelte:head>
	<title>nezu.world</title>
</svelte:head>

<Navbar {...data} />

<slot />
