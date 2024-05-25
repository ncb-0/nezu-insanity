<script>
import Card from "$lib/components/Card.svelte";

export let items;
</script>

{#if items.length}
	<div class="card-grid">
		{#each items as i}
			<Card item={i} />
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
