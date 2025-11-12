<script>
import { run } from "svelte/legacy";

import { goto } from "$app/navigation";
import { page } from "$app/state";
import Breadcrumb from "$lib/components/Breadcrumb.svelte";

let { currentURL, data, loading = false } = $props();

let y = $state(0);

let navbar = $state(null);
let navbarHeight = $state(30);

let fakeNav = $state();

$effect(() => {
	fakeNav.style.height = navbarHeight - 4 + "px";
});

$effect(() => {
	if (navbar) {
		if (y === 0) {
			navbar.classList.remove("scrolled");
		} else {
			navbar.classList.add("scrolled");
		}
	}
});

let shown = $state(false);

function toggleModal() {
	if (shown === true) {
		shown = false;
	} else if (shown === false) {
		shown = true;
	}
}
</script>

<svelte:window bind:scrollY={y} />

{#key currentURL}
	<nav class="real" bind:this={navbar} bind:clientHeight={navbarHeight}>
		<div>
			{#if currentURL === "/"}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					id="pira-top-left"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"
					/>
				</svg>
			{:else}
				<a href="/" class="clean">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xml:space="preserve"
						viewBox="0 0 24 24"
						id="pira-top-left"
					>
						<path
							fill="rgb(var(--text-color))"
							d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"
						/>
					</svg></a
				>
			{/if}
		</div>
		<div>
			<p>
				<Breadcrumb {currentURL} />
			</p>
			<p>
				{#if page.data.options.initial.data.myTags?.length && currentURL != "/" && !loading}
					<ul class="tags">
						{#if page.data.options.initial.data._type === "blogPost"}
							<date datetime={page.data.options.initial.data.date}
								>{page.data.options.initial.data.date}</date
							> |
						{/if}
						{#each page.data.options.initial.data.myTags as tag (tag._key)}
							<li class="tag"><a href="/tag/{tag._key}">{tag._key}</a></li>
						{/each}
					</ul>
				{:else if loading}
					<span>loading~</span>
				{:else if currentURL === "/"}
					<span>&lt;/&gt; with &lt;3 by <a href="/about">lisa m</a>, 2025.</span
					>
				{:else if page.data.options.initial.data._type === "artwork"}
					<date datetime={page.data.options.initial.data.date}
						>{page.data.options.initial.data.date}</date
					>
				{:else}
					<span>---</span>
				{/if}
			</p>
		</div>
		<!-- <div class="grid-right">
			<a href="javascript:void(0)" on:click={toggleModal} style="cursor: pointer"
				>about</a
			>
		</div> -->
	</nav>
{/key}

<nav class="fake" bind:this={fakeNav}></nav>

<!-- <nav class="fake">
	<div>
		{#if currentURL === "/"}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xml:space="preserve"
				viewBox="0 0 24 24"
				id="pira-top-left"
			>
				<path
					fill="rgb(var(--text-color))"
					d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"
				/>
			</svg>
		{:else}
			<a href="/" class="clean">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					id="pira-top-left"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"
					/>
				</svg></a
			>
		{/if}
	</div>
	<div>
		<p>
			<Breadcrumb {currentURL} />
		</p>
		<p>
			{#if page.data.options.initial.data.myTags?.length && currentURL != "/" && !loading}
				<ul class="tags">
					{#each page.data.options.initial.data.myTags as tag (tag._key)}
						<li class="tag"><a href="/tag/{tag._key}">{tag._key}</a></li>
					{/each}
				</ul>
			{:else if loading}
				<span>loading~</span>
			{:else}
				<span>---</span>
			{/if}
		</p>
	</div>
</nav> -->

<style>
nav.real {
	box-sizing: border-box;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	padding: 2px 1ex;
	/* margin-bottom: 1ex; */
	display: grid;
	background: rgba(var(--bg-color), 1);
	gap: 1ch;
	grid-template-columns: 4ex 1fr auto;
	z-index: 9999999;
}
nav.fake {
	box-sizing: border-box;
	/* position: fixed; */
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	visibility: hidden;

	/* padding: 2px 1ex; */
	/* margin-bottom: 1ex; */
	display: grid;
	background: rgba(var(--bg-color), 1);
	gap: 1ch;
	grid-template-columns: 4ex 1fr auto;
	z-index: -1 !important;
	opacity: 0 !important;
	pointer-events: none !important;
	user-select: none !important;
}
:global(nav.real) {
	border-bottom: 1px dashed rgba(var(--text-color), 0);
	transition: border 0.125s ease-in;
}
:global(nav.real.scrolled) {
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
