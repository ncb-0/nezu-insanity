<script lang="ts">
import { PortableText } from "@portabletext/svelte";
import { useQuery } from "@sanity/svelte-loader";
import { urlFor } from "$lib/sanity/image";
import type { PageData } from "./$types";
import Image from "$lib/components/Image.svelte";
import ImageGrid from "$lib/components/ImageGrid.svelte";
import ImageRow from "$lib/components/ImageRow.svelte";
import Break from "$lib/components/Break.svelte";

export let data: PageData;
$: q = useQuery(data);
$: ({ data: artwork } = $q);

console.log(data.options.initial.data.media);

function getImageDimensions(id) {
	const dimensions = id.split("-")[2];

	const [width, height] = dimensions.split("x").map((num) => parseInt(num, 10));
	const aspectRatio = width / height;

	return { width, height, aspectRatio };
}
</script>

<svelte:head>
	<title>{artwork.title} | nezu.world</title>
	<meta property="og:title" content="{artwork.title} | nezu.world" />
	<meta property="twitter:title" content="{artwork.title} | nezu.world" />
	<meta property="og:description" content="{artwork.title} by Lisa M." />
	<meta property="description" content="{artwork.title} by Lisa M." />
	<meta property="twitter:description" content="{artwork.title} by Lisa M." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />
	<meta property="twitter:card" content="summary" />
	{#if artwork.nsfw == true}
		<meta
			property="og:image"
			content={urlFor(artwork.mainImage).width(512).blur(128).url()}
		/>
	{:else}
		<meta
			property="og:image"
			content={urlFor(artwork.mainImage).width(512).url()}
		/>
	{/if}
</svelte:head>

<article class="narrow">
	<h1>{artwork.title}</h1>

	<Image src={artwork.mainImage} />

	{#if artwork.description}
		<PortableText
			components={{
				types: {
					image: Image,
					gallery: ImageGrid,
					imagerow: ImageRow,
					break: Break,
				},
			}}
			value={artwork.description}
		/>
	{/if}

	<hr />

	<p><b>Date:</b> {artwork.date}</p>

	{#if artwork.media}
		{#if artwork.media.length == 1}
			<h4>Medium:</h4>
		{:else}
			<h4>Media:</h4>
		{/if}
		<ul>
			{#each artwork.media as media}
				<li>{media.label}</li>
			{/each}
		</ul>
	{/if}
	{#if artwork.characters}
		{#if artwork.characters.length == 1}
			<h4>Character:</h4>
		{:else}
			<h4>Characters:</h4>
		{/if}
		<ul>
			{#each artwork.characters as character}
				<li>{character.label}</li>
			{/each}
		</ul>
	{/if}
</article>
