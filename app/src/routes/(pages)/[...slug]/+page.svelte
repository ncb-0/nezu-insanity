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

export let data: PageData;
const q = useQuery(data);

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
	<!-- <hr />
	<Giscus
		id="comments"
		repo="ncb-0/nezu-insanity"
		repoId="R_kgDOL_17LA"
		category="Announcements"
		categoryId="DIC_kwDOL_17LM4CflCf"
		mapping="pathname"
		reactionsEnabled="0"
		emitMetadata="0"
		inputPosition="top"
		theme="https://nezu-insanity.vercel.app/giscus.css"
		lang="en"
		loading="lazy"
	/> -->
</article>

<style>
article {
	max-width: 777px;
	/* margin: 0 auto; */
}
</style>
