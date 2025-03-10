<script lang="ts">
import { PortableText } from "@portabletext/svelte";
import { useQuery } from "@sanity/svelte-loader";
import { urlFor } from "$lib/sanity/image";
import type { PageData } from "./$types";
import Image from "$lib/components/Image.svelte";
import ImageGrid from "$lib/components/ImageGrid.svelte";
import ImageRow from "$lib/components/ImageRow.svelte";
import Break from "$lib/components/Break.svelte";
import { isCreateMutation } from "@sanity/types";

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
	<h3 style="margin-bottom: 0.5rem; margin-top: 0.5rem;">
		<a href={urlFor(artwork.mainImage).url()} target="_blank" class="button"
			>Fullres</a
		>
		<a href={urlFor(artwork.mainImage).forceDownload(true).url()} class="button"
			>Download</a
		>
	</h3>
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

	<section>
		<p><b>Date:</b> {artwork.date}</p>
		{#if artwork.media}
			{#if artwork.media.length == 1}
				<p>
					<b>Medium:</b>
					<a href="/art?media.0={artwork.media[0]._key}"
						>{artwork.media[0].label}</a
					>
				</p>
			{:else}
				<h4>Media</h4>
				<ul>
					{#each artwork.media as medium}
						<li><a href="/art?media.0={medium._key}">{medium.label}</a></li>
					{/each}
				</ul>
			{/if}
		{/if}
		{#if artwork.characters}
			{#if artwork.characters.length == 1}
				<p>
					<b>Character:</b>
					<a href="/art?character.0={artwork.characters[0]._key}">
						{artwork.characters[0].label}
					</a>
				</p>
			{:else}
				<h4>Characters</h4>
				<ul>
					{#each artwork.characters as character}
						<li>
							<a href="/art?character.0={character._key}">{character.label}</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</section>
</article>
