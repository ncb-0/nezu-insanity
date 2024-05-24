<script>
import { page } from "$app/stores";

let crumbs = [];

$: {
	// Remove zero-length tokens.
	const tokens = $page.url.pathname.split("/").filter((t) => t !== "");

	// Create { label, href } pairs for each token.
	let tokenPath = "";
	crumbs = tokens.map((t) => {
		tokenPath += "/" + t;
		t = t.charAt(0) + t.slice(1);
		return {
			label: $page.data.label || t,
			href: tokenPath,
		};
	});

	// Add a way to get home too.
	crumbs.unshift({ label: "nezu.world", href: "/" });
}
</script>

{#each crumbs as c, i}
	{#if i == crumbs.length - 1}
		<span class="label">
			{c.label}
		</span>
	{:else}
		<a href={c.href}>{c.label}</a>/
	{/if}
{/each}
