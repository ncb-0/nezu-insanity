<script>
import { urlFor } from "$lib/sanity/image";
import urlBuilder from "@sanity/image-url";

export let portableText;
export let src = portableText.value;
console.log(portableText.value._key);
</script>

<img src={urlFor(src).url()} />
