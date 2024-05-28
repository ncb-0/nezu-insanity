<script lang="ts">
import { PortableText } from "@portabletext/svelte";
import { useQuery } from "@sanity/svelte-loader";
import { urlFor } from "$lib/sanity/image";
import type { PageData } from "./$types";

export let data: PageData;
$: q = useQuery(data);
$: ({ data: artwork } = $q);
</script>

<svelte:head>
	<title>{artwork.title} | nezu.world</title>
	<meta property="og:title" content="{artwork.title} | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://v2.nezu.world{data.currentURL}" />
	<meta
		property="og:image"
		content={urlFor(artwork.mainImage).width(512).height(512).url()}
	/>
</svelte:head>

<article>
	<h1>{artwork.title}</h1>

	<img src={urlFor(artwork.mainImage).url()} alt="" />
</article>

<style>
article {
	max-width: 777px;
	/* margin: 0 auto; */
}
</style>
