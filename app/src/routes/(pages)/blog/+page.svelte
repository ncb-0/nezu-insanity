<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import Card from "$lib/components/Card.svelte";
import TextCard from "$lib/components/TextCard.svelte";
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
const q = useQuery(data);

$: ({ data: blogPosts } = $q);

console.log(data);
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

		<!-- <CardGrid items={blogPosts} baseURL="blog" /> -->
		<div class="blog-grid">
			{#each blogPosts as post}
				<TextCard item={post} baseURL="/blog" />
			{/each}
		</div>
	</section>
</article>
