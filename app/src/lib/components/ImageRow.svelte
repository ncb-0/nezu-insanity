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
				<img src={urlFor(image).url()} alt={image.alt} />
				<figcaption>
					{image.caption}
				</figcaption>
			</figure>
		{:else}
			<img src={urlFor(image).url()} alt={image.alt} />
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
