<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
const q = useQuery(data);

$: ({ data: tags } = $q);
</script>

<section>
	<h1>
		tags:
		{#if tags.length}
			{#each tags as tag}
				<span class="tag"><a href="/tag/{tag}">{tag}</a></span>
			{/each}
		{/if}
	</h1>

	<!-- {#if tags.length}
		<ul class="tags">
			{#each tags as tag}
				<li class="tag"><a href="/tag/{tag}">{tag}</a></li>
			{/each}
		</ul>
	{/if} -->
</section>
