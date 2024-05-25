<script lang="ts">
import { formatDate } from "$lib/utils";
import { urlFor } from "$lib/sanity/image";
import type { Post } from "$lib/sanity/queries";

// export let post: Post;
export let item;
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
	<a href={`/${item.slug.current}`}>
		{#if item.mainImage}
			<img src={urlFor(item.mainImage).width(512).height(512).url()} />
		{/if}

		{#if item.shortTitle}
			<p>{item.shortTitle}</p>
		{:else if item.title}
			<p>{item.title}</p>
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
	padding: 0.5rem 0.5rem 0.25rem;
	border: 1px solid rgba(var(--text-color), 0.3);
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
.card p {
	margin: 0;
	line-height: 2ex;
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
</style>
