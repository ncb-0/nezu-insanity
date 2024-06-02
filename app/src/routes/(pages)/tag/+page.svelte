<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;
const q = useQuery(data);

$: ({ data: tags } = $q);
</script>

<svelte:head>
	<title>tags | nezu.world</title>
	<meta property="og:title" content="tags | nezu.world" />
	<meta
		property="og:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta
		property="description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:title" content="tags | nezu.world" />
	<meta
		property="twitter:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta property="twitter:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="twitter:creator" content="@ncb0_" />
</svelte:head>

<article>
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
</article>

<style>
article {
	max-width: 100%;
	/* margin: 0 auto; */
}
</style>
