<script>
import { urlFor } from "$lib/sanity/image";
import urlBuilder from "@sanity/image-url";
import OutClick from "svelte-outclick";

export let portableText;
export let src = portableText.value;
export let showLightbox = false;
export let style = "";

function getImageDimensions(id) {
	const dimensions = id.split("-")[2];

	const [width, height] = dimensions.split("x").map((num) => parseInt(num, 10));
	const aspectRatio = width / height;

	return { width, height, aspectRatio };
}

function toggleLightbox() {
	if (showLightbox == true) {
		showLightbox = false;
	} else {
		showLightbox = true;
	}
}

function getFileExtension(filename) {
	return filename.substring(filename.lastIndexOf("-") + 1);
}

const fileExtension = getFileExtension(src.asset._ref);

$: console.log(fileExtension);
</script>

<svelte:window
	on:scroll={() => {
		showLightbox = false;
	}}
/>

<figure
	class={src.floatLeft ? "float-left" : src.floatRight ? "float-right" : ""}
	on:click={toggleLightbox}
	{style}
>
	<img
		src={urlFor(src).url()}
		width={getImageDimensions(src.asset._ref).width}
		height={getImageDimensions(src.asset._ref).height}
		alt={src.alt}
		style="aspect-ratio: {getImageDimensions(src.asset._ref)
			.width} / {getImageDimensions(src.asset._ref).height}"
	/>
	{#if src.caption}
		<figcaption>
			{src.caption}
		</figcaption>
	{/if}
</figure>

<!-- {:else}
	<img
		src={urlFor(src).url()}
		width={getImageDimensions(src.asset._ref).width}
		height={getImageDimensions(src.asset._ref).height}
		alt={src.alt}
		style="aspect-ratio: {getImageDimensions(src.asset._ref)
			.width} / {getImageDimensions(src.asset._ref).height}; {style}"
		on:click={toggleLightbox}
	/>
{/if} -->

{#if showLightbox == true}
	<div class="shade" on:click={toggleLightbox}>
		<figure class="lightbox">
			<img
				src={fileExtension == "svg"
					? urlFor(src).format("png").url()
					: urlFor(src).url()}
				width={getImageDimensions(src.asset._ref).width}
				height={getImageDimensions(src.asset._ref).height}
				alt={src.alt}
				style="aspect-ratio: {getImageDimensions(src.asset._ref)
					.width} / {getImageDimensions(src.asset._ref).height}"
			/>
			{#if src.caption}
				<figcaption>
					{src.caption}
				</figcaption>
			{/if}
		</figure>
	</div>
{/if}

<style>
figure,
img {
	cursor: pointer;
	/* max-width: 100%; */
}
.lightbox {
	display: none;
	display: block;
	/* position: fixed; */
	/* padding: 2rem; */
	/* margin-bottom: 1rem; */
	/* top: 50%;
	left: 50%; */
	/* transform: translate(-50%, -50%); */
	z-index: 99999999;
	/* max-width: 50%; */
	width: auto;
	/* height: 100dvh; */
	height: 100%;
}
.lightbox * {
	cursor: normal;
}
.lightbox img {
	/* max-width: 100%; */
	max-height: calc(100dvh - 6rem);
	width: auto;
	/* height: 100%; */
	/* margin: 0; */
	/* box-shadow:
		0 0.5ex 2ex rgba(var(--text-color-neutral), 0.2),
		0 1ex 4ex rgba(var(--text-color-neutral), 0.1); */
	/* box-shadow:
		0 0.5ex 2ex rgba(var(--text-color), 0.2),
		0 1ex 4ex rgba(var(--text-color), 0.1); */
}
.lightbox figcaption {
	font-size: 1rem;
	margin-top: 1ex;
	opacity: 1;
	/* color: rgb(var(--text-color-neutral)); */
}
.shade {
	display: grid;
	place-content: center;

	/* display: flex;
	justify-content: center;
	align-content: center; */

	position: fixed;
	padding: 3rem;
	margin: 0;
	top: 0;
	left: 0;
	width: 100%;
	height: 100dvh;
	/* overflow: hidden; */
	background: rgba(var(--bg-color), 0.8);
	/* background: rgba(var(--bg-color-neutral), 0.8); */
	backdrop-filter: blur(8px);
	z-index: 99999998;
	cursor: pointer;
}
</style>
