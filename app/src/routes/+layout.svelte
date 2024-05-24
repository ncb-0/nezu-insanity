<script lang="ts">
import "$lib/styles/style.css";
import "$lib/styles/fonts.css";
import { page } from "$app/stores";
import Navbar from "$lib/components/Navbar.svelte";
export let data;
</script>

<Navbar {...data} />

<slot />
