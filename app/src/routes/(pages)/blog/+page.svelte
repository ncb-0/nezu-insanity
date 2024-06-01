<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
const q = useQuery(data);

$: ({ data: blogPosts } = $q);
</script>

<svelte:head>
	<title>blog | nezu.world</title>
	<meta property="og:title" content="blog | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
</svelte:head>

<article>
	<section>
		<h1>blog</h1>

		<CardGrid items={blogPosts} baseURL="blog" />
	</section>
</article>

<style>
article {
	max-width: 100%;
	/* margin: 0 auto; */
}
</style>
