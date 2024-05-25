<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
import Card from "$lib/components/Card.svelte";
const q = useQuery(data);

$: ({ data: tags } = $q);
</script>

<section>
	<h1>all tags</h1>

	{#if tags.length}
		<ul class="tags">
			{#each tags as tag}
				<li class="tag"><a href="/tag/{tag}">{tag}</a></li>
			{/each}
		</ul>
	{/if}
</section>
