<script>
export let portableText;

export let { buttonText, href, inline } = portableText.value;
</script>

{#if inline}
	<a {href} class="button">{buttonText}</a>
{:else}
	<h3>
		<a {href} class="button">{buttonText}</a>
	</h3>
{/if}
