<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import Card from "$lib/components/Card.svelte";
import TextCard from "$lib/components/TextCard.svelte";
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
interface Props {
	data: PageData;
}

let { data }: Props = $props();
const q = useQuery(data);

let { data: blogPosts } = $derived($q);

console.log(data);
</script>

<svelte:head>
	<title>blog | nezu.world</title>
	<meta property="og:title" content="blog | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Lisa M.’s blog." />
	<meta property="og:description" content="Lisa M.’s blog." />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />
	<meta
		property="og:image"
		content="https://nezu.world/android-chrome-512x512.png"
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:title" content="blog | nezu.world" />
	<meta property="twitter:description" content="Lisa M.’s blog." />
	<meta property="twitter:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="twitter:creator" content="@ncb0_" />
	<meta
		property="twitter:image"
		content="https://nezu.world/android-chrome-512x512.png"
	/>
</svelte:head>

<article>
	<section>
		<h1>
			blog <a
				href="/rss.xml"
				target="_blank"
				class="clean"
				aria-label="rss"
				title="rss"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					class="icon"
					viewBox="-271 273 307.2 307.2"
				>
					<g fill="rgb(var(--text-color))" transform="translate(25.6,25.6)">
						<path
							d="M-271 360v48.9c31.9 0 62.1 12.6 84.7 35.2s35.1 52.8 35.1 84.8v.1h49.1c0-46.6-19-88.7-49.6-119.4-30.5-30.6-72.7-49.5-119.3-49.6M-237 460.9c-9.4 0-17.8 3.8-24 10s-10 14.6-10 24c0 9.3 3.8 17.7 10 23.9 6.2 6.1 14.6 9.9 24 9.9s17.8-3.7 24-9.9 10-14.6 10-23.9c0-9.4-3.8-17.8-10-24s-14.6-10-24-10"
						/>
						<path
							d="M-90.1 348.1c-46.3-46.4-110.2-75.1-180.8-75.1v48.9c114.1.1 206.8 93 206.9 207.1h49c0-70.6-28.7-134.5-75.1-180.9"
						/>
					</g>
				</svg>
			</a>
		</h1>

		<!-- <CardGrid items={blogPosts} baseURL="blog" /> -->
		<div class="blog-grid">
			{#each blogPosts as post}
				<TextCard item={post} baseURL="/blog" />
			{/each}
		</div>
	</section>
</article>
