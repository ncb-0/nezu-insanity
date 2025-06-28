<script lang="ts">
import { useQuery } from "@sanity/svelte-loader";
import CardGrid from "$lib/components/CardGrid.svelte";
import TextCard from "$lib/components/TextCard.svelte";
import type { PageData } from "./$types";
import { urlFor } from "$lib/sanity/image";
import { devicePixelRatio } from "svelte/reactivity/window";

let dpr = $derived(Math.ceil(devicePixelRatio.current ?? 1));

interface Props {
	data: PageData;
}

let { data }: Props = $props();
const q = useQuery(data);

let { data: posts } = $derived($q);
</script>

<svelte:head>
	<title>nezu.world</title>
	<meta property="og:title" content="nezu.world" />
	<meta
		property="og:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta
		property="description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta
		property="og:image"
		content="https://nezu.world/android-chrome-512x512.png"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world/" />
	<meta property="og:site_name" content="nezu.world" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta
		property="twitter:image"
		content="https://nezu.world/android-chrome-512x512.png"
	/>
	<meta property="twitter:title" content="nezu.world" />
	<meta
		property="twitter:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta property="twitter:url" content="https://nezu.world/" />
	<meta property="twitter:creator" content="@ncb0_" />
</svelte:head>

<article>
	<section>
		<h1>
			<!-- <a href="/">nezu.world</a> is under construction. -->
			{#if data.params.lang === "jp"}
				ボク<a href="about">lisa m</a>です。トロント出身のアーティストです。
			{:else}
				i’m <a href="about">lisa m</a>, an artist & designer in toronto, canada.
			{/if}
		</h1>
		<!-- <h2>
			(current version: <a href="https://v1.nezu.world" target="_blank"
				>v1.nezu.world</a
			>)
		</h2> -->
	</section>

	<section>
		<h3>
			<a target="_blank" href="https://patreon.com/lovelynezu" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M22 7.63c0-2.8-2.18-5.1-4.74-5.92a15.12 15.12 0 0 0-10.39.55C3.2 4 2.05 7.8 2 11.58c-.03 3.11.28 11.31 4.9 11.37 3.44.05 3.95-4.38 5.54-6.52 1.13-1.51 2.59-1.94 4.38-2.38 3.08-.77 5.18-3.2 5.18-6.42z"
					/>
				</svg>
				Patreon</a
			>
			<a
				target="_blank"
				href="https://bsky.app/profile/nezu.world"
				class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M12 11.23C11 9.3 8.27 5.68 5.75 3.9c-2.4-1.7-3.33-1.4-3.93-1.13-.7.32-.82 1.39-.82 2.02 0 .63.34 5.18.57 5.94.75 2.5 3.4 3.35 5.85 3.08l.38-.05-.38.05c-3.58.53-6.77 1.83-2.59 6.48 4.6 4.76 6.3-1.01 7.17-3.95.88 2.93 1.88 8.5 7.09 3.95 3.91-3.95 1.07-5.95-2.51-6.48a7.96 7.96 0 0 1-.38-.05l.38.05c2.44.27 5.1-.58 5.85-3.08.22-.77.57-5.3.57-5.94 0-.63-.12-1.7-.82-2.02-.6-.28-1.53-.57-3.94 1.13-2.54 1.79-5.25 5.4-6.25 7.33Z"
					/>
				</svg>
				Bluesky</a
			>
			<a target="_blank" href="https://instagram.com/lovelynezu" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M12 3.4c2.8 0 3.1 0 4.2.1 2.8.1 4.2 1.5 4.3 4.3.1 1.1.1 1.4.1 4.2 0 2.8 0 3.1-.1 4.2-.1 2.8-1.5 4.2-4.3 4.3-1.1.1-1.4.1-4.2.1-2.8 0-3.1 0-4.2-.1-2.9-.1-4.2-1.5-4.3-4.3-.1-1.1-.1-1.4-.1-4.2 0-2.8 0-3.1.1-4.2C3.6 5 5 3.6 7.8 3.5c1.1-.1 1.4-.1 4.2-.1zm0-1.9c-2.9 0-3.2 0-4.3.1-3.8.1-6 2.3-6.1 6.1-.1 1.1-.1 1.4-.1 4.3s0 3.2.1 4.3c.2 3.8 2.3 5.9 6.1 6.1 1.1.1 1.5.1 4.3.1s3.2 0 4.3-.1c3.8-.2 5.9-2.3 6.1-6.1.1-1.1.1-1.5.1-4.3s0-3.2-.1-4.3c-.2-3.8-2.3-5.9-6.1-6.1-1.1-.1-1.4-.1-4.3-.1zm0 5.1C9 6.6 6.6 9 6.6 12S9 17.4 12 17.4s5.4-2.4 5.4-5.4c0-3-2.4-5.4-5.4-5.4zm0 8.9c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.6-10.4c-.7 0-1.3.6-1.3 1.3s.6 1.3 1.3 1.3c.7 0 1.3-.6 1.3-1.3s-.6-1.3-1.3-1.3z"
					/>
				</svg>
				Instagram</a
			>
			<a
				target="_blank"
				href="https://www.pixiv.net/en/users/63526507"
				class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					style="enable-background:new 0 0 24 24"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M20.5 4.4C18.7 2.9 16.2 2 13.3 2 5.8 2 .7 7.7.7 7.7l1.4 2.2s.8.1.4-1.3C2.9 8 3.6 7.1 5 6v15c-.6.2-1.4.5-.9 1h4.1c.5-.5-.3-.9-.8-1v-3.5s2.8 1.1 5.9 1.1c2.7 0 5.1-.8 7-2.2 1.8-1.4 3-3.5 3-5.9 0-2.4-1-4.6-2.8-6.1zm-2.2 10.8a7.6 7.6 0 0 1-5.2 2c-2.4 0-4.3-.4-5.6-1.1V4.9c1.4-1 3.8-1.6 5.6-1.6 2.3 0 4.1.8 5.3 2.1 1.2 1.3 1.9 3 1.9 5 0 1.9-.7 3.5-2 4.8z"
					/>
				</svg>
				Pixiv</a
			>
			<a target="_blank" href="https://twitter.com/ncb0_" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M23.9 4.8c-.8.4-1.7.6-2.7.7 1-.6 1.7-1.5 2.1-2.6-.9.5-1.9.9-3 1.1-.9-.9-2.1-1.5-3.4-1.5-3 0-5.2 2.8-4.6 5.7C8.4 8.1 5 6.3 2.7 3.4 1.4 5.5 2 8.3 4.1 9.7c-.8-.1-1.5-.3-2.1-.6-.1 2.2 1.5 4.2 3.7 4.6-.7.2-1.4.2-2.1.1C4.2 15.7 6 17 8 17.1c-2 1.5-4.4 2.2-6.9 1.9 2.1 1.3 4.5 2.1 7.2 2.1 8.7 0 13.6-7.3 13.3-13.9.8-.7 1.6-1.5 2.3-2.4z"
					/>
				</svg>
				Twitter</a
			>
			<a target="_blank" href="https://lovelynezu.tumblr.com" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M14.6 23c-3.3 0-5.8-1.7-5.8-5.8v-6.5h-3V7.2c3.3-.9 4.7-3.7 4.9-6.2h3.4v5.6h4v4.1h-4v5.7c0 1.7.9 2.3 2.2 2.3h1.9V23h-3.6z"
					/>
				</svg>
				Tumblr</a
			>
			<a target="_blank" href="https://www.are.na/lisa-m" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="m23.77 14.85-3.33-2.61a.37.37 0 0 1 0-.59l3.33-2.61c.2-.16.29-.43.19-.6-.1-.17-.38-.23-.62-.13l-3.96 1.57c-.24.1-.47-.03-.5-.3l-.6-4.21c-.03-.26-.23-.47-.43-.47-.2 0-.39.21-.42.47l-.6 4.22c-.03.26-.26.39-.5.3l-3.9-1.56a1.36 1.36 0 0 0-.87 0L7.67 9.88c-.24.1-.47-.03-.5-.3l-.6-4.21c-.03-.26-.23-.47-.43-.47-.2 0-.39.21-.43.47l-.6 4.22c-.03.26-.25.39-.5.3L.67 8.3c-.24-.1-.52-.04-.62.13-.1.17-.01.44.2.6l3.32 2.61c.2.16.2.43 0 .59L.23 14.85c-.2.16-.29.45-.19.64.1.19.38.26.62.17l3.92-1.58c.24-.1.47.04.5.3l.56 4.25c.04.26.26.47.5.47s.47-.21.5-.47l.57-4.26c.03-.25.26-.38.5-.29l3.85 1.55c.24.1.64.1.88 0l3.85-1.55c.24-.1.47.04.5.3l.57 4.25c.03.26.26.47.5.47.23 0 .46-.21.5-.47l.56-4.26c.03-.25.26-.38.5-.29l3.92 1.58c.24.1.52.02.62-.17.1-.2.01-.48-.2-.64zm-8.47-2.58-2.93 2.25a.64.64 0 0 1-.74 0L8.7 12.27c-.2-.16-.21-.42 0-.58l2.93-2.31c.2-.16.54-.16.74 0l2.94 2.31c.2.16.2.42 0 .58z"
					/>
				</svg>
				Are.na</a
			>
			<a target="_blank" href="https://ko-fi.com/nezita" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M22.6 9.8c-.3-1.5-1.1-2.5-2-3.1-.9-.6-1.9-.9-3-.9H2.5c-.5 0-.7.5-.7.8v10.5c.1 2.1 2.2 2.1 2.2 2.1h10.3c.2 0 .3 0 .5-.1 1.9-.5 2.1-2.2 2.1-3.2 3.7.2 6.4-2.5 5.7-6.1zM13 12.9c-1.1 1.3-3.5 3.5-3.5 3.5s-.1.1-.3 0c-.1 0-.1-.1-.1-.1-.4-.4-2.9-2.7-3.5-3.5-.6-.8-.9-2.3-.1-3.2.8-.9 2.6-.9 3.8.4 0 0 1.4-1.6 3-.8 1.7.6 1.6 2.5.7 3.7zm5.4.4c-.8.1-1.5 0-1.5 0v-5h1c.7 0 1.3.3 1.7.8.3.4.5.8.5 1.5.1 1.7-.8 2.4-1.7 2.7z"
					/>
				</svg>
				Ko-fi</a
			>
			<a target="_blank" href="https://nezita.itch.io" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 24 24"
					class="icon"
				>
					<path
						fill="rgb(var(--text-color))"
						d="M3.6 1.9c-1 .6-2.9 2.8-3 3.4v1c0 1.2 1.2 2.3 2.2 2.3 1.3 0 2.3-1 2.3-2.3 0 1.2 1 2.3 2.3 2.3 1.3 0 2.2-1 2.2-2.3 0 1.2 1.1 2.3 2.3 2.3 1.3 0 2.3-1 2.3-2.3 0 1.2 1 2.3 2.2 2.3 1.3 0 2.3-1 2.3-2.3 0 1.2 1 2.3 2.3 2.3 1 0 2.2-1.1 2.2-2.3v-1c0-.6-2-2.8-3-3.4-3.1-.1-5.2-.1-8.4-.1-3 0-7.3 0-8.2.1zm6 6.1c-.1.3-.2.4-.4.6-.5.5-1.1.8-1.8.8S6 9.1 5.5 8.6c-.2-.2-.3-.3-.4-.5-.1.2-.3.3-.5.5-.5.5-1.1.8-1.8.8h-.2c-.1 1.1-.1 2.1-.2 2.8v1.1c0 2.2-.2 7.2 1 8.4 1.8.4 5.2.6 8.7.6 3.4 0 6.8-.2 8.7-.6 1.2-1.2 1-6.2 1-8.4v-1.1c0-.7-.1-1.7-.2-2.8h-.2c-.7 0-1.4-.3-1.8-.8-.2-.2-.3-.3-.5-.6-.1.2-.3.4-.4.6-.5.5-1.2.8-1.8.8-.7 0-1.4-.3-1.8-.8-.2-.2-.3-.4-.4-.6-.1.2-.3.4-.4.6-.5.5-1.2.8-1.8.8h-.2c-.7 0-1.4-.3-1.8-.8-.6-.2-.7-.3-.9-.6zm-1.9 2.5c.8 0 1.4 0 2.2.9.7-.1 1.3-.1 2-.1s1.4 0 2 .1c.8-.9 1.5-.9 2.2-.9.4 0 1.8 0 2.8 2.8l1.1 3.8c.8 2.8-.3 2.9-1.5 2.9-1.9-.1-3-1.5-3-2.9a19.83 19.83 0 0 1-7 0c0 1.4-1.1 2.8-3 2.9-1.3 0-2.3-.1-1.5-2.9l1-3.8c1-2.8 2.4-2.8 2.7-2.8zm4.3 2.2s-2 1.9-2.4 2.5l1.3-.1v1.2c0 .1.5 0 1.1 0h1.1v-1.2l1.3.1c-.4-.7-2.4-2.5-2.4-2.5z"
					/>
				</svg>
				Itch.io</a
			>
			<a target="_blank" href="https://github.com/ncb-0" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon"
					viewBox="0 0 98 96"
				>
					<path
						fill="rgb(var(--text-color))"
						fill-rule="evenodd"
						d="M48.85 0C21.84 0 0 22 0 49.22 0 70.97 14 89.39 33.4 95.9c2.43.49 3.32-1.06 3.32-2.37 0-1.14-.08-5.05-.08-9.12-13.59 2.93-16.42-5.87-16.42-5.87-2.18-5.7-5.42-7.17-5.42-7.17-4.45-3.01.33-3.01.33-3.01 4.93.32 7.52 5.05 7.52 5.05 4.37 7.5 11.4 5.38 14.23 4.07.4-3.18 1.7-5.38 3.08-6.6-10.84-1.14-22.25-5.38-22.25-24.28 0-5.38 1.94-9.78 5.02-13.2-.49-1.22-2.19-6.28.48-13.04 0 0 4.13-1.3 13.43 5.05a46.97 46.97 0 0 1 12.21-1.63 47 47 0 0 1 12.22 1.63c9.3-6.35 13.42-5.05 13.42-5.05 2.67 6.76.97 11.82.49 13.04a18.9 18.9 0 0 1 5.01 13.2c0 18.9-11.4 23.06-22.32 24.28 1.78 1.55 3.32 4.48 3.32 9.13 0 6.6-.08 11.9-.08 13.52 0 1.3.89 2.86 3.31 2.37a49.18 49.18 0 0 0 33.4-46.7C97.72 22 75.8 0 48.86 0z"
						clip-rule="evenodd"
					/>
				</svg>

				GitHub</a
			>
			<a target="_blank" href="https://www.youtube.com/@ncb0_" class="button"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon"
					viewBox="0 0 24 24"
				>
					<path
						fill="rgb(var(--text-color))"
						fill-rule="evenodd"
						d="m 12,4.2996421 c 0,0 -6.8805198,1.295e-4 -8.59554,0.4601237 C 2.4573136,5.0133062 1.7136645,5.7569475 1.4601242,6.7041016 1.00013,8.4191142 1.0000005,12 1.0000005,12 c 0,0 1.295e-4,3.58087 0.4601237,5.295897 0.2535403,0.947147 0.9971894,1.69084 1.9443358,1.944337 C 5.1194802,19.700254 12,19.700358 12,19.700358 c 0,0 6.880589,-1.04e-4 8.595539,-0.460124 0.947148,-0.253497 1.690841,-0.99719 1.944336,-1.944337 C 22.999895,15.58087 23,12 23,12 23,12 22.9981,8.4191142 22.539875,6.7041016 22.286379,5.7569475 21.542686,5.0133062 20.595539,4.7597658 18.880589,4.2997716 12,4.2996421 12,4.2996421 Z M 9.7978517,8.700358 15.512694,12 9.7978517,15.299641 Z"
						clip-rule="evenodd"
					/>
				</svg> YouTube</a
			>
		</h3>
	</section>

	<section data-sveltekit-preload-data="hover">
		<h2>
			{#if data.params.lang === "jp"}
				ポートフォリオ
			{:else}
				portfolio
			{/if}
		</h2>

		{#await data.options.initial then posts}
			<CardGrid
				items={posts.data}
				baseURL={data.params.lang === "en" ? "" : data.params.lang}
			/>
		{/await}
	</section>

	<section>
		<h2>
			{#if data.params.lang === "jp"}
				<a href="/jp/blog#">ブログ…</a>
			{:else}
				<a href="/blog#">blog…</a>
			{/if}
		</h2>
		<div class="blog-grid">
			{#await data.blogPosts then blogPosts}
				{#each blogPosts.data as blogPost}
					<TextCard
						item={blogPost}
						baseURL={data.params.lang === "en"
							? "/blog"
							: `/${data.params.lang}/blog`}
					/>
				{/each}
			{/await}
		</div>
	</section>

	<section>
		<h2>
			{#if data.params.lang === "jp"}
				<a href="/jp/art#">ギャラリー…</a>
			{:else}
				<a href="/art#">gallery…</a>
			{/if}
		</h2>
		<div class="thumbs" data-sveltekit-preload-data="hover">
			{#await data.artworks then artworks}
				{#each artworks.data as artwork}
					<div class="thumb">
						<a
							href={data.params.lang === "en"
								? `art/${artwork.year}/${artwork.slug.current}`
								: `/${data.params.lang}/art/${artwork.year}/${artwork.slug.current}`}
							class="clean"
						>
							<img
								src={urlFor(artwork.mainImage)
									.format("webp")
									.quality(50)
									.auto("format")
									.bg("ffff")
									.width(64)
									.height(64)
									.fit("max")
									.blur(artwork.nsfw ? 32 * dpr : 1)
									.dpr(dpr)
									.url()}
								width="96px"
								height="96px"
								style="aspect-ratio: 1 / 1;"
								title={artwork.nsfw ? `${artwork.title} (NSFW)` : artwork.title}
							/>
						</a>
					</div>
				{/each}
			{/await}
		</div>
	</section>

	<section>
		<h2>
			{#if data.params.lang === "jp"}
				<a href="/jp/type#">書体デザイン…</a>
			{:else}
				<a href="/type#">type design…</a>
			{/if}
		</h2>
	</section>

	<section>
		<h2>
			{#if data.params.lang === "jp"}
				<a href="/jp/tag#">タグ…</a>
			{:else}
				<a href="/tag#">tags…</a>
			{/if}
		</h2>
		{#if data.tags.data.length}
			<ul class="tags">
				{#each data.tags.data as tag}
					<li class="tag"><a href="/tag/{tag}">{tag}</a></li>
				{/each}
			</ul>
		{/if}
	</section>
</article>

<style>
article {
	max-width: 100%;
	/* margin: 0 auto; */
}
.thumbs {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(calc(37.5px + 0.5rem), 1fr));
	/* gap: 0.5rem; */
}
.thumb {
	margin: 0;
	padding: 0;
	line-height: 0;
}
.thumb:hover {
	opacity: 0.5;
}
</style>
