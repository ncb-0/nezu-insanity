<script>
import Card from "$lib/components/Card.svelte";

export let items;
export let text = true;
export let blog = false;
export let baseURL = ".";
</script>

{#if items.length}
	<div class="card-grid" data-sveltekit-preload-data="hover">
		{#each items as i}
			<Card item={i} {baseURL} {text} {blog} />
		{/each}
	</div>
{/if}
