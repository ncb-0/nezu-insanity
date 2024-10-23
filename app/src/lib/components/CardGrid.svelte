<script>
import Card from "$lib/components/Card.svelte";

let { items, text = true, blog = false, baseURL = "." } = $props();
</script>

{#if items.length}
	<div class="card-grid" data-sveltekit-preload-data="hover">
		{#each items as i}
			<Card item={i} {baseURL} {text} {blog} />
		{/each}
	</div>
{/if}
