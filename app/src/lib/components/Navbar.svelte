<script>
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import Breadcrumb from "$lib/components/Breadcrumb.svelte";
import Modal from "$lib/components/Modal.svelte";
import OutClick from "svelte-outclick";

export let currentURL;
export let data;

let y = 0;
let navbar = null;

$: {
	if (navbar) {
		if (y === 0) {
			console.log("bye");
			navbar.classList.remove("scrolled");
		} else {
			console.log("hi");
			navbar.classList.add("scrolled");
		}
	}
}

let shown = false;

function toggleModal() {
	if (shown === true) {
		shown = false;
	} else if (shown === false) {
		shown = true;
	}
}
</script>

<svelte:window bind:scrollY={y} />

<nav bind:this={navbar}>
	<div>
		{#if currentURL === "/"}
			<svg
				id="pira-top-left"
				class="txtfill"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 768 768"
				xml:space="preserve"
				><path
					fill="rgb(var(--text-color))"
					d="M282.3,244.4c-95.8,15-139.1,56.9-139.1,137.6c0,25.4,4.5,45.9,14.5,69.3C57.4,419.9,15,362.1,15,257.8 C15,83.3,136.6,0,384,0s369,83.3,369,257.8c0,104.2-42.4,162.1-142.6,193.5c10-23.4,14.5-43.9,14.5-69.3 c0-80.8-43.4-122.7-139.1-137.6l215.4,374h-175L612.4,768H455.3L384,644.3L312.7,768H155.6l86.3-149.6h-175L282.3,244.4z M316.7,543.6V408.9h-29.9v134.6H316.7z M481.2,543.6V408.9h-29.9v134.6H481.2z"
				/></svg
			>
		{:else}
			<a href="/" class="clean"
				><svg
					id="pira-top-left"
					class="txtfill"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 768 768"
					xml:space="preserve"
					><path
						fill="rgb(var(--text-color))"
						d="M282.3,244.4c-95.8,15-139.1,56.9-139.1,137.6c0,25.4,4.5,45.9,14.5,69.3C57.4,419.9,15,362.1,15,257.8 C15,83.3,136.6,0,384,0s369,83.3,369,257.8c0,104.2-42.4,162.1-142.6,193.5c10-23.4,14.5-43.9,14.5-69.3 c0-80.8-43.4-122.7-139.1-137.6l215.4,374h-175L612.4,768H455.3L384,644.3L312.7,768H155.6l86.3-149.6h-175L282.3,244.4z M316.7,543.6V408.9h-29.9v134.6H316.7z M481.2,543.6V408.9h-29.9v134.6H481.2z"
					/></svg
				></a
			>
		{/if}
	</div>
	<div>
		<p>
			<Breadcrumb />
		</p>
		<p>
			{#if $page.data.options.initial.data.myTags}
				<ul class="tags">
					{#each $page.data.options.initial.data.myTags as tag (tag._key)}
						<li class="tag"><a href="/tag/{tag._key}">{tag._key}</a></li>
					{/each}
				</ul>
			{/if}
		</p>
	</div>
	<!-- <div class="grid-right">
		<a href="javascript:void(0)" on:click={toggleModal} style="cursor: pointer"
			>about</a
		>
	</div> -->
</nav>

<OutClick
	on:outclick={() => {
		if (shown === true) {
			shown = false;
		}
	}}
	excludeQuerySelectorAll="a"
>
	<Modal {shown} {...data}>
		<section>
			<h2>
				nezu.world is the homepage of lisa m., an artist & designer in toronto,
				canada.
			</h2>
		</section>
		<section>
			<h3>availability</h3>
			<p>i am available for freelance work~ i do flyers, album covers, etc.</p>
		</section>
		<section>
			<h3>contact</h3>
			<p>
				forward complaints: <a href="mailto:lisa@nezu.world">lisa@nezu.world</a>
			</p>
		</section>
	</Modal>
</OutClick>

<style>
nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	padding: 2px 1ex;
	display: grid;
	background: rgba(var(--bg-color), 1);
	gap: 1ch;
	grid-template-columns: 4ex 1fr auto;
	z-index: 9999999;
}
:global(nav) {
	border-bottom: 1px dashed rgba(var(--text-color), 0);
	transition: border 0.125s ease-in;
}
:global(.scrolled) {
	border-bottom: 1px dashed rgba(var(--text-color), 0.3);
	transition: border 0.25s ease-out;
}
nav div {
	color: rgb(var(--text-color));
}
nav p {
	margin: 0;
}
#pira-top-left {
	display: inline;
	height: 24px;
	transform: translate(0, 2px);
	z-index: 9999;
}
</style>
