<script>
import { page } from "$app/stores";

let { currentURL = "/" } = $props();

let crumbs = $state([]);

// Remove zero-length tokens.
const tokens = currentURL.split("/").filter((t) => t !== "");

// Check if first token is a language parameter (en|jp)
const isLanguageParam = (token) => /^(en|jp)$/.test(token);

// Create { label, href } pairs for each token.
let tokenPath = "";
let startIndex = 0;

// Handle the base URL with potential language parameter
if (tokens.length > 0 && isLanguageParam(tokens[0])) {
	// Combine language with base URL
	const langToken = tokens[0];
	tokenPath = "/" + langToken;
	crumbs.push({
		label: `nezu.world/${langToken}`,
		href: tokenPath,
	});
	startIndex = 1;
} else {
	// No language parameter, just add base URL
	crumbs.push({ label: "nezu.world", href: "/" });
}

// Process remaining tokens
for (let i = startIndex; i < tokens.length; i++) {
	const t = tokens[i];
	tokenPath += "/" + t;
	const label = t.charAt(0) + t.slice(1);
	crumbs.push({
		label: $page.data.label || label,
		href: tokenPath,
	});
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
