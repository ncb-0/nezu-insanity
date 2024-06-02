<script>
import { urlFor } from "$lib/sanity/image";
import Image from "$lib/components/Image.svelte";

export let portableText;

function getImageDimensions(id) {
	const dimensions = id.split("-")[2];

	const [width, height] = dimensions.split("x").map((num) => parseInt(num, 10));
	const aspectRatio = width / height;

	return { width, height, aspectRatio };
}
</script>

<!-- <div class="image-grid">
	{#each portableText.value.images as image (image._key)}
		{#if image.caption}
			<figure>
				<img
					src={urlFor(image).url()}
					width={getImageDimensions(image.asset._ref).width}
					height={getImageDimensions(image.asset._ref).height}
					alt={image.alt}
					style="aspect-ratio: {getImageDimensions(image.asset._ref)
						.width} / {getImageDimensions(image.asset._ref).height}"
				/>
				<figcaption>{image.caption}</figcaption>
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
</div> -->

<div class="image-grid">
	{#each portableText.value.images as image (image._key)}
		<Image src={image} />
	{/each}
</div>

<style>
.image-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	/* grid-template-columns: 1fr 1fr; */
	gap: 0.5rem;
}
</style>
