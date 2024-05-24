<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import Card from "$lib/components/Card.svelte";
import type { PageData } from "./$types";

export let data: PageData;
const q = useQuery(data);

$: ({ data: posts } = $q);
</script>

<section>
	<h1>lisa m (she/her/it) is an artist & designer in toronto, canada.</h1>
</section>

<section>
	<h2>portfolio</h2>

	{#if posts.length}
		<div class="card-grid">
			{#each posts as post}
				<Card {post} />
			{/each}
		</div>
	{/if}
</section>

<style>
.card-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 0.5rem;
}
</style>
