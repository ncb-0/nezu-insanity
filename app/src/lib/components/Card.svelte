<script lang="ts">
import { formatDate } from "$lib/utils";
import { urlFor } from "$lib/sanity/image";
import type { Post } from "$lib/sanity/queries";
import { base } from "$app/paths";

// export let post: Post;
export let item;
export let baseURL = "";
export let text = true;
export let blog = false;
export let nsfw = false;

let date = Date.parse(item._createdAt);
</script>

<div class="card">
	<div class="dogear">
		<svg
			version="1.1"
			id="Layer_1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="0 0 16 16"
			xml:space="preserve"
		>
			<rect fill="rgb(var(--bg-color))" width="16" height="16" />
			<g>
				<polygon
					fill="rgb(var(--bg-color))"
					points="0.5,15.5 0.5,1.2 14.8,15.5 	"
				/>
				<path
					fill="rgb(var(--text-color))"
					d="M1,2.4L13.6,15H1V2.4 M0,0v16h16L0,0L0,0z"
				/>
			</g>
		</svg>
	</div>
	{#if baseURL == ""}
		<a href={`/${item.slug.current}`} title={item.title}>
			{#if item.mainImage && !nsfw}
				<img
					src={urlFor(item.mainImage)
						.format("png")
						.width(512)
						.height(512)
						.url()}
				/>
			{:else if nsfw}
				<img
					src={urlFor(item.mainImage)
						.format("png")
						.width(512)
						.height(512)
						.blur(128)
						.url()}
				/>
				<span class="nsfw">nsfw</span>
			{/if}

			{#if item.mainImage}
				{#if text == true}
					<div class="pad">
						{#if item.shortTitle}
							<p>{item.shortTitle}</p>
						{:else if item.title}
							<p>{item.title}</p>
						{/if}
					</div>
				{/if}
			{:else}
				<div class="pad">
					<h3>{item.title}</h3>
					<time datetime={item.date}>{item.date}</time>
					<p>{item.excerpt}</p>
				</div>
			{/if}
			<!-- <h3>{formatDate(item._createdAt)}</h3> -->
		</a>
	{:else}
		<a href={`${baseURL}/${item.slug.current}`} title={item.title}>
			{#if item.mainImage && !nsfw}
				<img
					src={urlFor(item.mainImage)
						.format("png")
						.width(512)
						.height(512)
						.url()}
				/>
			{:else if nsfw}
				<img
					src={urlFor(item.mainImage)
						.format("png")
						.width(512)
						.height(512)
						.blur(128)
						.url()}
				/>
				<span class="nsfw">nsfw</span>
			{/if}

			{#if item.mainImage}
				{#if text == true}
					<div class="pad">
						{#if item.shortTitle}
							<p>{item.shortTitle}</p>
						{:else if item.title}
							<p>{item.title}</p>
						{/if}
					</div>
				{/if}
			{:else}
				<div class="pad">
					<h3>{item.title}</h3>
					<time datetime={item.date}>{item.date}</time>
					<p>{item.excerpt}</p>
				</div>
			{/if}
			<!-- <h3>{formatDate(item._createdAt)}</h3> -->
		</a>
	{/if}
</div>

<style>
.card {
	position: relative;
	display: block;
	width: fit-content;
	background-color: rgb(var(--bg-color));
	text-decoration: none;
	/* padding: 0.5rem 0.5rem 0.25rem; */
	padding: 0;
	border: 1px solid rgba(var(--text-color), 0.3);
	line-height: 0;
}
.card:hover {
	/* background-color: rgba(var(--text-color), 0.1); */
	/* background-color: rgba(var(--bg-color), 1); */
	border: 1px solid rgba(var(--text-color), 1);
}
.card:hover .dogear {
	display: block;
}
.card a {
	text-decoration: none;
}
.card a:hover {
	background: none;
	color: rgb(var(--text-color));
}
.card p,
.card span,
.card h3,
.card time {
	margin-top: 0;
	/* padding: 2px 2px 0; */
	line-height: 2ex;
}
.pad {
	padding: 4px 4px 1px;
}
.card a img {
	background-color: white;
}
.dogear {
	/* display: none; */
	cursor: pointer;
	pointer-events: none;
	display: none;
	width: 16px;
	height: 16px;
	position: absolute;
	z-index: 10000;
	top: -1px;
	right: -1px;
}
span.nsfw {
	font-size: 2rem;
	font-weight: 700;
	font-family: var(--font-sans);
	color: #fff;
	text-shadow:
		rgba(var(--text-color-light), 1) 0 0 6px,
		rgba(var(--text-color-light), 1) 0 0 12px,
		rgba(var(--text-color-light), 1) 0 0 24px;
	position: absolute;
	text-align: center;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	user-select: none;
	pointer-events: none;
}
</style>
