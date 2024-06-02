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
	<meta property="og:description" content="Lisa M.’s blog." />
	<meta property="og:description" content="Lisa M.’s blog." />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:title" content="blog | nezu.world" />
	<meta property="twitter:description" content="Lisa M.’s blog." />
	<meta property="twitter:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="twitter:creator" content="@ncb0_" />
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
