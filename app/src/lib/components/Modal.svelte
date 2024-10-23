<script>
let { shown = false, children } = $props();
</script>

<!-- <div class="shade"></div> -->
<div class="help" {shown}>
	{@render children?.()}
</div>

<style lang="postcss">
.shade {
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
	background: #ffffff00;
	backdrop-filter: blur(10px);
	/* backdrop-filter: grayscale(100%); */

	z-index: 99998;
	pointer-events: none;
}
.help[shown="true"] {
	/* display: block; */
	opacity: 1;
	transform: scaleY(1);
	transition: all 50ms;
}
.help[shown="false"] {
	/* display: none; */
	opacity: 0;
	transform: scaleY(0);
	transition: all 200ms;
}
.help {
	transform-origin: top right;
	position: fixed;
	color: rgb(var(--text-color));
	background: rgb(var(--bg-color));
	position: fixed;
	top: 3ex;
	right: 1ex;
	margin-left: 1ex;
	/* inset: 3ex 1ex; */
	padding: 1ex;
	border: 1px dashed rgba(var(--text-color), 0.3);
	/* box-shadow: 0 0.5ex 1ex rgba(var(--text-color), 0.2); */
	box-sizing: border-box;
	max-width: 512px;
	max-height: calc(100vmin - 4ex);
	z-index: 99999999;
	text-align: left;
	overflow-y: scroll;
	text-wrap: pretty;
	hyphens: none;
}
section + section {
	margin-top: 2ex;
}
h1 + h1 {
	margin: 0;
	text-indent: 2ch;
}
svg {
	/* filter: invert(); */
	/* position: relative; */
	/* filter: drop-shadow(0px 1000px 0 rgb(var(--text-color))); */
	/* transform: translateY(-1000px); */
	display: inline;
	/* display: none; */
	line-height: 0;
	image-rendering: pixelated;
	vertical-align: middle;
	transform: translateY(-1px);
}
</style>
