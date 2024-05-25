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

export let data: PageData;
$: q = useQuery(data);
$: ({ data: post } = $q);
</script>

<article>
	<h1>{post.title}</h1>

	{#if post.body}
		<PortableText
			components={{
				types: {
					image: Image,
					gallery: ImageGrid,
					imagerow: ImageRow,
					break: Break,
				},
			}}
			value={post.body}
		/>
	{/if}

	{#if data.children.data.length > 0}
		<hr />
		<h2>subpages</h2>
		<CardGrid items={data.children.data} />
	{/if}
</article>

<style>
article {
	max-width: 777px;
	/* margin: 0 auto; */
}
</style>
