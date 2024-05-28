<script>
import { urlFor } from "$lib/sanity/image";
import urlBuilder from "@sanity/image-url";

export let portableText;
export let floatLeft = false;
export let floatRight = false;
export let src = portableText.value;
console.log(portableText.value);

function getImageDimensions(id) {
	const dimensions = id.split("-")[2];

	const [width, height] = dimensions.split("x").map((num) => parseInt(num, 10));
	const aspectRatio = width / height;

	return { width, height, aspectRatio };
}
</script>

{#if src.caption}
	<figure>
		<img
			src={urlFor(src).url()}
			width={getImageDimensions(src.asset._ref).width}
			height={getImageDimensions(src.asset._ref).height}
			alt={src.alt}
			style="aspect-ratio: {getImageDimensions(src.asset._ref)
				.width} / {getImageDimensions(src.asset._ref).height}"
		/>
		<figcaption>
			{src.caption}
		</figcaption>
	</figure>
{:else}
	<img
		src={urlFor(src).url()}
		width={getImageDimensions(src.asset._ref).width}
		height={getImageDimensions(src.asset._ref).height}
		alt={src.alt}
		style="aspect-ratio: {getImageDimensions(src.asset._ref)
			.width} / {getImageDimensions(src.asset._ref).height}"
	/>
{/if}
