<script>
let {
	portableText,
	buttonText = portableText.value.buttonText,
	href = portableText.value.href,
	inline = portableText.value.inline,
} = $props();

// export let { buttonText, href, inline } = portableText.value;
</script>

{#if inline}
	<a {href} class="button" target="_blank">{buttonText}</a>
{:else}
	<h3>
		<a {href} class="button" target="_blank"> {buttonText}</a>
	</h3>
{/if}
