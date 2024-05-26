<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
import Card from "$lib/components/Card.svelte";
import CardGrid from "$lib/components/CardGrid.svelte";
import { urlFor } from "$lib/sanity/image";

const q = useQuery(data);

$: ({ data: tags } = $q);

console.log(data.params.tag);
console.log(data.currentURL);
</script>

<svelte:head>
	<title>#{data.params.tag} | nezu.world</title>
	<meta property="og:title" content="#{data.params.tag} | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://v2.nezu.world{data.currentURL}" />
</svelte:head>

<article>
	<section>
		<h1>tagged: #{data.params.tag}</h1>

		<CardGrid items={tags} />
	</section>
</article>

<style>
article {
	max-width: 100vw;
	/* margin: 0 auto; */
}
</style>
