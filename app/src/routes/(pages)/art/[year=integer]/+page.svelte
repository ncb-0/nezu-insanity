<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
const q = useQuery(data);

$: ({ data: artworks } = $q);

console.log(data.params);
</script>

<svelte:head>
	<title>{data.params.year} gallery | nezu.world</title>
	<meta property="og:title" content="{data.params.year} gallery | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://v2.nezu.world/{data.currentURL}" />
</svelte:head>

<article>
	<h1>{data.params.year} gallery</h1>

	<CardGrid items={artworks} baseURL={data.params.year} />
</article>

<style>
article {
	max-width: 100vw;
	/* margin: 0 auto; */
}
</style>
