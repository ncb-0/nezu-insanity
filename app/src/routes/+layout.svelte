<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { page } from "$app/stores";
import Navbar from "$lib/components/Navbar.svelte";
export let data;
</script>

<svelte:head>
	<title>nezu.world</title>
</svelte:head>

<Navbar {...data} />

<slot />
