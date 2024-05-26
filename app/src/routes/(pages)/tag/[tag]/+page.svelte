<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
import Card from "$lib/components/Card.svelte";
import CardGrid from "$lib/components/CardGrid.svelte";

const q = useQuery(data);

$: ({ data: tags } = $q);

console.log(data.params.tag);
</script>

<svelte:head>
	<title>#{data.params.tag} | nezu.world</title>
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
