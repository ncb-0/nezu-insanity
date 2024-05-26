<script>
import { urlFor } from "$lib/sanity/image";

export let portableText;

console.log(portableText.value.images[0].alt);
</script>

<div class="image-grid">
	{#each portableText.value.images as image (image._key)}
		{#if image.caption}
			<figure>
				<img src={urlFor(image).url()} alt={image.alt} />
				<figcaption>{image.caption}</figcaption>
			</figure>
		{:else}
			<img src={urlFor(image).url()} alt={image.alt} />
		{/if}
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
