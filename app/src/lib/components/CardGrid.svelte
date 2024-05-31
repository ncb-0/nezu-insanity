<script>
import Card from "$lib/components/Card.svelte";

export let items;
export let text = true;
export let blog = false;
export let baseURL = ".";
</script>

{#if items.length}
	<div class="card-grid" data-sveltekit-preload-data="tap">
		{#each items as i}
			<Card item={i} {baseURL} {text} {blog} />
		{/each}
	</div>
{/if}

<style>
.card-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 0.5rem;
}
</style>
