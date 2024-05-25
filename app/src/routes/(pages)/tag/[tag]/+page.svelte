<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
import Card from "$lib/components/Card.svelte";
const q = useQuery(data);

$: ({ data: tags } = $q);

console.log(data.params.tag);
</script>

<section>
	<h1>tagged: #{data.params.tag}</h1>
	{#if tags.length}
		<div class="card-grid">
			{#each tags as post}
				<Card {post} />
			{/each}
		</div>
	{/if}
</section>
