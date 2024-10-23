<script lang="ts">
import { PortableText } from "@portabletext/svelte";
import { useQuery } from "@sanity/svelte-loader";
import { urlFor } from "$lib/sanity/image";
import type { PageData } from "./$types";
import Image from "$lib/components/Image.svelte";
import ImageGrid from "$lib/components/ImageGrid.svelte";
import ImageRow from "$lib/components/ImageRow.svelte";
import Break from "$lib/components/Break.svelte";

interface Props {
	data: PageData;
}

let { data }: Props = $props();
let q = $derived(useQuery(data));
let { data: artwork } = $derived($q);

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

		<hr />
	{/if}

	<p><b>Date:</b> {artwork.date}</p>

	{#if artwork.media}
		{#if artwork.media.length == 1}
			<p><b>Medium:</b> {artwork.media[0].label}</p>
		{:else}
			<h4>Media</h4>
			<ul>
				{#each artwork.media as medium}
					<li>{medium.label}</li>
				{/each}
			</ul>
		{/if}
	{/if}
	{#if artwork.characters}
		{#if artwork.characters.length == 1}
			<p><b>Character:</b> {artwork.characters[0].label}</p>
		{:else}
			<h4>Characters</h4>
			<ul>
				{#each artwork.characters as character}
					<li>{character.label}</li>
				{/each}
			</ul>
		{/if}
	{/if}
</article>
