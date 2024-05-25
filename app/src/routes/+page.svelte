<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import Card from "$lib/components/Card.svelte";
import type { PageData } from "./$types";

export let data: PageData;
const q = useQuery(data);

$: ({ data: posts } = $q);
</script>

<section>
	<!-- <h1>lisa m (she/her/it) is an artist & designer in toronto, canada.</h1> -->
	<h1>
		<a href="/">v2.nezu.world</a> is under construction.
	</h1>
	<h2>
		(current version: <a href="https://v1.nezu.world" target="_blank"
			>v1.nezu.world</a
		>)
	</h2>
</section>

<section>
	<h2>portfolio:</h2>

	{#if posts.length}
		<div class="card-grid">
			{#each posts as post}
				<Card {post} />
			{/each}
		</div>
	{/if}
</section>
