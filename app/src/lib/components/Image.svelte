<script>
import { urlFor } from "$lib/sanity/image";
import urlBuilder from "@sanity/image-url";

export let portableText;
export let floatLeft = false;
export let floatRight = false;
export let src = portableText.value;
console.log(portableText.value);
</script>

{#if src.caption && !floatLeft && !floatRight}
	<figure>
		<img src={urlFor(src).url()} alt={src.alt} />
		<figcaption>
			{src.caption}
		</figcaption>
	</figure>
{:else if floatLeft == true}
	<figure class="float-left">
		<img src={urlFor(src).url()} alt={src.alt} />
		<figcaption>
			{src.caption}
		</figcaption>
	</figure>
{:else if floatRight == true}
	<figure class="float-right">
		<img src={urlFor(src).url()} alt={src.alt} />
		<figcaption>
			{src.caption}
		</figcaption>
	</figure>
{:else}
	<img src={urlFor(src).url()} alt={src.alt} />
{/if}
