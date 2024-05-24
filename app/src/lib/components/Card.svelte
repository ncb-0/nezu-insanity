<script lang="ts">
import { formatDate } from "$lib/utils";
import { urlFor } from "$lib/sanity/image";
import type { Post } from "$lib/sanity/queries";

export let post: Post;
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
	<a href={`${post.slug.current}`}>
		{#if post.mainImage}
			<img src={urlFor(post.mainImage).width(512).height(512).url()} />
		{/if}

		<p>{post.title}</p>
		<!-- <h3>{formatDate(post._createdAt)}</h3> -->
	</a>
</div>

<style>
.card {
	position: relative;
	display: block;
	width: fit-content;
	background-color: rgb(var(--bg-color));
	text-decoration: none;
	padding: 1ex 1ex 0.5ex;
	border: 1px solid rgba(var(--text-color), 0.2);
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
	display: none;
	width: 16px;
	height: 16px;
	position: absolute;
	z-index: 1000;
	top: -1px;
	right: -1px;
}
</style>
