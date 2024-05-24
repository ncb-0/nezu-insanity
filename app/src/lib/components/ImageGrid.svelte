<script>
import { urlFor } from "$lib/sanity/image";

export let portableText;
</script>

<div class="image-grid">
	{#each portableText.value.images as image (image._key)}
		<img src={urlFor(image).url()} />
	{/each}
</div>

<style>
.image-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	/* grid-template-columns: 1fr 1fr; */
	gap: 1ex;
}
</style>
