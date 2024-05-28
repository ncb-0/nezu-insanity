<script>
import { urlFor } from "$lib/sanity/image";

export let portableText;

function getImageDimensions(id) {
	const dimensions = id.split("-")[2];

	const [width, height] = dimensions.split("x").map((num) => parseInt(num, 10));
	const aspectRatio = width / height;

	return { width, height, aspectRatio };
}
</script>

<div class="image-row">
	{#each portableText.value.images as image (image._key)}
		{#if image.caption}
			<figure style="flex: {getImageDimensions(image.asset._ref).aspectRatio}">
				<img
					src={urlFor(image).url()}
					width={getImageDimensions(image.asset._ref).width}
					height={getImageDimensions(image.asset._ref).height}
					alt={image.alt}
					style="aspect-ratio: {getImageDimensions(image.asset._ref)
						.width} / {getImageDimensions(image.asset._ref).height}"
				/>
				<figcaption>
					{image.caption}
				</figcaption>
			</figure>
		{:else}
			<img
				src={urlFor(image).url()}
				width={getImageDimensions(image.asset._ref).width}
				height={getImageDimensions(image.asset._ref).height}
				alt={image.alt}
				style="aspect-ratio: {getImageDimensions(image.asset._ref)
					.width} / {getImageDimensions(image.asset._ref).height}"
			/>
		{/if}
	{/each}
</div>

<style>
.image-row {
	display: flex;
	flex-direction: row;
	gap: 1ex;
	width: 100%;
	height: min-content;
}
.image-row figure {
	display: block;
	max-width: 100%;
}
.image-row figure img {
	width: 100%;
}
</style>
