<script lang="ts">
import { PortableText } from "@portabletext/svelte";
import { useQuery } from "@sanity/svelte-loader";
import { formatDate } from "$lib/utils";
import { urlFor } from "$lib/sanity/image";
import type { PageData } from "./$types";
import Image from "$lib/components/Image.svelte";
import ImageGrid from "$lib/components/ImageGrid.svelte";
import ImageRow from "$lib/components/ImageRow.svelte";
import Break from "$lib/components/Break.svelte";
import Giscus from "@giscus/svelte";
import CardGrid from "$lib/components/CardGrid.svelte";
import Button from "$lib/components/Button.svelte";

export let data: PageData;
$: q = useQuery(data);
$: ({ data: post } = $q);

$: console.log(data);
</script>

<svelte:head>
	<title>{post.title} | nezu.world</title>
	<meta property="og:title" content="{post.title} | nezu.world" />
	<meta property="og:description" content={post.excerpt || "Lisa M.’s blog."} />
	<meta property="description" content={post.excerpt || "Lisa M.’s blog."} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />

	<!-- Twitter -->
	<meta name="twitter:creator" content="@ncb0_" />
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:title" content="{post.title} | nezu.world" />
	<meta
		property="twitter:description"
		content={post.excerpt || "Lisa M.’s blog."}
	/>
	<meta property="twitter:url" content="https://nezu.world{data.currentURL}" />
</svelte:head>

<article class="narrow serif-2">
	<h1>{post.title}</h1>
	<!-- <h2><date datetime={post.date}>{post.date}</date></h2> -->

	{#if post.body}
		<PortableText
			components={{
				types: {
					image: Image,
					gallery: ImageGrid,
					imagerow: ImageRow,
					break: Break,
					button: Button,
				},
			}}
			value={post.body}
		/>
	{/if}
</article>
