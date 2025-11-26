<script>
import { run } from "svelte/legacy";

import { urlFor } from "$lib/sanity/image";
import urlBuilder from "@sanity/image-url";

import { devicePixelRatio } from "svelte/reactivity/window";

let {
	portableText,
	src = portableText.value,
	showLightbox = $bindable(false),
	style = "",
	fullres = false,
} = $props();

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

let dpr = $derived(Math.ceil(devicePixelRatio.current ?? 1));
// let dpr = $derived(devicePixelRatio.current);

// $inspect(devicePixelRatio.current);
// $inspect(`raw dpr: ${dpr}`);
</script>

<svelte:window
	onscroll={() => {
		showLightbox = false;
	}}
/>

<figure
	class={src.floatLeft ? "float-left" : src.floatRight ? "float-right" : ""}
	onclick={toggleLightbox}
	{style}
>
	<img
		src={fileExtension == "svg" || fileExtension == "gif" || fullres == true
			? urlFor(src).url()
			: urlFor(src)
					.width(1280)
					.fit("max")
					.dpr(dpr)
					.format("webp")
					.quality(80)
					.auto("format")
					.url()}
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

{#if showLightbox == true}
	<div class="shade" onclick={toggleLightbox}>
		<figure class="lightbox">
			<img
				src={urlFor(src)
					.width(1280)
					.fit("max")
					.dpr(dpr)
					.format("webp")
					.quality(80)
					.auto("format")
					.url()}
				width={getImageDimensions(src.asset._ref).width}
				height={getImageDimensions(src.asset._ref).height}
				alt={src.alt}
				style="aspect-ratio: {getImageDimensions(src.asset._ref)
					.width} / {getImageDimensions(src.asset._ref).height}"
				loading="lazy"
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
figure {
	padding: 0;
	line-height: 0;
}
figcaption {
	margin-top: 0.5ex;
	line-height: 2ex;
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
	/* padding: 0.5rem; */
	padding: 0;
	margin: 0;
	top: 0;
	left: 0;
	width: 100%;
	height: 100dvh;
	/* overflow: hidden; */
	background: rgba(var(--bg-color), 0.95);
	/* background: rgba(var(--bg-color-neutral), 0.8); */
	/* backdrop-filter: blur(8px); */
	z-index: 99999998;
	cursor: pointer;
}
</style>
