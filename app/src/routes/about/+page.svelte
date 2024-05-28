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
		<img
			src="/img/nezureal.jpg"
			width="256px"
			class="float-right"
			style="margin-top: 10px"
		/>
		<h1 style="margin: 0;">
			nezu.world is the homepage of lisa m., an artist & designer in toronto,
			canada.
		</h1>
	</section>
	<section>
		<p>
			I’m Lisa. (she/her/it) I’m a multidisciplinary artist from Toronto. My
			work spans <a href="/art">digital and traditional art</a>,
			<a href="/tag/design">graphic design</a>, type design,
			<a href="/tag/writing">creative writing</a>,
			<a href="/tag/dj">DJ</a>, whatever. I’m cute and I do a little bit of
			everything.
		</p>
		<h2>availability</h2>
		<p>i am available for freelance work~ i do flyers, album covers, etc.</p>
		<h2>contact</h2>
		<p>
			forward complaints: <a href="mailto:lisa@nezu.world">lisa@nezu.world</a>
		</p>
	</section>
</article>

<style>
article {
	max-width: 777px;
	/* margin: 0 auto; */
}
</style>
