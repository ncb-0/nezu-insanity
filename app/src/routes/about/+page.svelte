<script lang="ts">
import type { PageData } from "./$types";
export let data: PageData;
</script>

<svelte:head>
	<title>v2.nezu.world</title>
	<meta property="og:title" content="nezu.world" />
	<meta
		property="og:description"
		content="The homepage of Lisa M., an artist & designer in Toronto, Canada."
	/>
	<meta
		property="og:image"
		content="https://v2.nezu.world/icon/android-chrome-512x512.png"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://v2.nezu.world/" />
</svelte:head>

<article>
	<section>
		<h1>about</h1>

		<p>
			<figure class="float-right">
				<img src="/img/nezureal.jpg" />
				<figcaption>Lisa in her mouse-human hybrid form…</figcaption>
			</figure>
		</p>

		<p>
			i’m Lisa. (she/her/it) i’m a multidisciplinary artist from toronto. my
			work spans <a href="/art">digital and traditional art</a>,
			<a href="/tag/design">graphic design</a>, <a href="/type">type design</a>,
			<a href="/tag/writing">creative writing</a>,
			<a href="/tag/dj">dj</a>, whatever. i’m cute and i do a little bit of
			everything~
		</p>

		<h2>availability</h2>
		<p>
			i am available for freelance work~ i do <a href="/dollhouse">flyers</a>,
			<a href="/mutants">album covers</a>, etc. i’m mostly looking for bigger
			jobs—i’m not really looking for art commissions.
		</p>

		<h2>contact</h2>
		<p>
			forward complaints: <a href="mailto:lisa@nezu.world">lisa@nezu.world</a>
		</p>

		<h2>elsewhere</h2>
		<h3>
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
		</h3>

		<hr style="clear: none;" />

		<p>&lt;/&gt; WITH &lt;3 BY LISA M (C) 2024.</p>

		<h4 id="fonts">Fonts</h4>

		<ul>
			<li>
				Helvetica
				<!-- - tm-lagrange-mono (top secret…!) -->
			</li>
			<li>
				<a
					href="https://github.com/weiweihuanghuang/fragment-mono"
					target="_blank">Fragment Mono</a
				> (Modified)
			</li>
		</ul>

		<h4 id="tools">Tools</h4>

		<ul>
			<li>Visual Studio Code</li>
			<li>Inkscape</li>
			<li>Adobe Illustrator CC</li>
			<li>Clip Studio Paint</li>
			<li><a href="https://kit.svelte.dev" target="_blank">SvelteKit</a></li>
			<li><a href="https://sanity.io" target="_blank">Sanity CMS</a></li>
			<li><a href="https://vercel.com" target="_blank">Vercel</a></li>
		</ul>
	</section>
</article>

<style>
article {
	max-width: 777px;
	/* margin: 0 auto; */
	overflow: auto;
}
</style>
