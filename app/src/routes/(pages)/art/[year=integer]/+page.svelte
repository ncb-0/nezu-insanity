<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import Card from "$lib/components/Card.svelte";
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
	<meta
		property="og:description"
		content="Art by Lisa M. ({data.params.year})"
	/>
	<meta property="description" content="Art by Lisa M. ({data.params.year})" />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />
	<meta property="twitter:card" content="summary" />
	<meta
		property="twitter:title"
		content="{data.params.year} gallery | nezu.world"
	/>
	<meta
		property="twitter:description"
		content="Art by Lisa M. ({data.params.year})"
	/>
	<meta property="twitter:url" content="https://nezu.world/{data.currentURL}" />
	<meta
		property="og:image"
		content="https://nezu.world/icon/android-chrome-512x512.png"
	/>
	<meta
		property="twitter:image"
		content="https://nezu.world/icon/android-chrome-512x512.png"
	/>
</svelte:head>

<article>
	<h1>{data.params.year} gallery</h1>

	<div class="card-grid">
		{#each artworks as artwork}
			{#if artwork.nsfw == true}
				<Card item={artwork} baseURL={artwork.year} text="false" nsfw="true" />
			{:else}
				<Card item={artwork} baseURL={artwork.year} text="false" />
			{/if}
		{/each}
	</div>
</article>

<style>
article {
	max-width: 100%;
	/* margin: 0 auto; */
}
</style>
