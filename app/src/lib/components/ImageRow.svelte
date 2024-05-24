<script>
import { urlFor } from "$lib/sanity/image";

export let portableText;

console.log(portableText.value.images[0].asset._ref);

function getImageDimensions(id) {
	const dimensions = id.split("-")[2];

	const [width, height] = dimensions.split("x").map((num) => parseInt(num, 10));
	const aspectRatio = width / height;

	return { width, height, aspectRatio };
}
</script>

<div class="image-row">
	{#each portableText.value.images as image (image._key)}
		<div style="flex: {getImageDimensions(image.asset._ref).aspectRatio}">
			<img src={urlFor(image).url()} />
		</div>
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
.image-row div {
	display: block;
	max-width: 100%;
}
.image-row div img {
	width: 100%;
}
</style>
