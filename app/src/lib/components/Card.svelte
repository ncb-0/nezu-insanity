<script lang="ts">
import { urlFor } from "$lib/sanity/image";

// export let post: Post;
export let item;
export let baseURL = "";
export let text = true;
export let nsfw = false;
</script>

<div class="card">
	<div class="dogear">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xml:space="preserve"
			viewBox="0 0 18 18"
		>
			<path fill="rgb(var(--bg-color))" d="M0 0h18v18H0z" />
			<path fill="rgb(var(--bg-color))" d="m.5 3.2 14.3 14.3H.5z" />
			<path
				fill="rgb(var(--text-color))"
				d="M1 4.4 13.6 17H1V4.4M0 2v16h16L0 2Z"
			/>
		</svg>
	</div>
	<a
		href={`${baseURL ? `${baseURL}/` : "/"}${item.slug.current}`}
		title={item.title}
	>
		{#if item.mainImage && !nsfw}
			<img
				src={urlFor(item.mainImage)
					.format("jpg")
					.width(512)
					.height(512)
					.bg("ffff")
					.url()}
				width="512px"
				height="512px"
				style="aspect-ratio: 1 / 1"
				loading="lazy"
			/>
		{:else if nsfw}
			<img
				src={urlFor(item.mainImage)
					.format("jpg")
					.width(512)
					.height(512)
					.blur(128)
					.bg("ffff")
					.url()}
				width="512px"
				height="512px"
				style="aspect-ratio: 1 / 1"
				loading="lazy"
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
	grid-column: span 1;
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
	/* line-height: 0; */
	padding: 0;
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
	/* background-color: white; */
	aspect-ratio: 1 / 1;
}
.dogear {
	/* display: none; */
	cursor: pointer;
	pointer-events: none;
	display: none;
	width: 18px;
	height: 18px;
	position: absolute;
	z-index: 10000;
	top: -3px;
	right: -3px;
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
