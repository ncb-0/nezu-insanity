<script>
import { urlFor } from "$lib/sanity/image";
import urlBuilder from "@sanity/image-url";

export let portableText;
export let src = portableText.value;
console.log(portableText.value);
</script>

{#if src.caption}
	<figure>
		<img src={urlFor(src).url()} alt={src.alt} />
		<figcaption>
			{src.caption}
		</figcaption>
	</figure>
{:else}
	<img src={urlFor(src).url()} alt={src.alt} />
{/if}
