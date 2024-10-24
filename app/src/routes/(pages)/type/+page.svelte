<script>
import FontTester from "$lib/components/FontTester.svelte";
export let data;
</script>

<svelte:head>
	<title>type design | nezu.world</title>
	<meta property="og:title" content="tags | nezu.world" />
	<meta property="og:description" content="Typefaces designed by Lisa M." />
	<meta property="description" content="Typefaces designed by Lisa M." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:title" content={data.title} />
	<meta property="twitter:description" content={data.description} />
	<meta property="twitter:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="twitter:creator" content="@ncb0_" />
	<meta
		property="og:image"
		content="https://nezu.world/android-chrome-512x512.png"
	/>
	<meta
		property="twitter:image"
		content="https://nezu.world/android-chrome-512x512.png"
	/>
</svelte:head>

<article>
	<section>
		<h1>type design</h1>
		<p>
			I design fonts! For licensing information, contact <a
				href="mailto:lisa@nezu.world">lisa@nezu.world</a
			>.
		</p>
	</section>

	<section>
		<h2 id="tm-lagrange-mono">tm-lagrange-mono</h2>
		<p>A monospaced clarendon.</p>
		<FontTester
			fontFamily="Lagrange Mono"
			fontSize="48"
			fontStyles={[
				{
					weight: 400,
					style: "normal",
					name: "Regular",
				},
				{
					weight: 400,
					style: "italic",
					name: "Italic",
				},
			]}
		/>
	</section>

	<section>
		<h2 id="tm-mega">tm-mega</h2>
		<p>
			A sturdy sans serif with superelliptical curves and a Frutigerian flair.
			Mega supports Latin Plus (incl. Pinyin & Vietnamese), extended Cyrillic,
			and polytonic Greek. 9000+ kerning pairs.
		</p>
		<FontTester
			fontFamily="Mega"
			fontSize="48"
			fontStyles={[
				{
					weight: 100,
					style: "normal",
					name: "Hairline",
				},
				{
					weight: 200,
					style: "normal",
					name: "Extralight",
				},
				{
					weight: 300,
					style: "normal",
					name: "Thin",
				},
				{
					weight: 400,
					style: "normal",
					name: "Light",
				},
				{
					weight: 500,
					style: "normal",
					name: "Regular",
				},
				{
					weight: 600,
					style: "normal",
					name: "Medium",
				},
				{
					weight: 700,
					style: "normal",
					name: "Bold",
				},
				{
					weight: 800,
					style: "normal",
					name: "Heavy",
				},
				{
					weight: 900,
					style: "normal",
					name: "Black",
				},
			]}
		/>
	</section>

	<section>
		<h2 id="tm-pico">tm-pico</h2>
		<p>
			A cute sans-serif with a crude geometric feel and minimal optical
			corrections. Pico supports Latin Plus (incl. Pinyin & Vietnamese) and
			basic Cyrillic.
		</p>
		<h3 id="tm-pico-a">tm-pico-A</h3>
		<p>Non-rounded variant.</p>
		<FontTester
			fontFamily="Pico A"
			fontSize="48"
			fontStyles={[
				{
					weight: 50,
					style: "normal",
					name: "Hairline",
				},
				{
					weight: 100,
					style: "normal",
					name: "Extralight",
				},
				{
					weight: 200,
					style: "normal",
					name: "Light",
				},
				{
					weight: 300,
					style: "normal",
					name: "Semilight",
				},
				{
					weight: 400,
					style: "normal",
					name: "Book",
				},
				{
					weight: 450,
					style: "normal",
					name: "Regular",
				},
				{
					weight: 500,
					style: "normal",
					name: "Medium",
				},
				{
					weight: 700,
					style: "normal",
					name: "Bold",
				},
				{
					weight: 800,
					name: "Black",
				},
			]}
		/>

		<h3 id="tm-pico-a-mono">tm-pico-A-mono</h3>
		<p>Monospaced variant of Pico A.</p>
		<FontTester
			fontFamily="Pico A Mono"
			fontSize="48"
			fontStyles={[
				{
					weight: 50,
					style: "normal",
					name: "Hairline",
				},
				{
					weight: 100,
					style: "normal",
					name: "Extralight",
				},
				{
					weight: 200,
					style: "normal",
					name: "Light",
				},
				{
					weight: 300,
					style: "normal",
					name: "Semilight",
				},
				{
					weight: 400,
					style: "normal",
					name: "Book",
				},
				{
					weight: 450,
					style: "normal",
					name: "Regular",
				},
				{
					weight: 500,
					style: "normal",
					name: "Medium",
				},
				{
					weight: 700,
					style: "normal",
					name: "Bold",
				},
				{
					weight: 800,
					name: "Black",
				},
			]}
		/>

		<h3 id="tm-pico-b">tm-pico-B</h3>
		<p>Rounded variant.</p>
		<FontTester
			fontFamily="Pico B"
			fontSize="48"
			fontStyles={[
				{
					weight: 50,
					style: "normal",
					name: "Hairline",
				},
				{
					weight: 100,
					style: "normal",
					name: "Extralight",
				},
				{
					weight: 200,
					style: "normal",
					name: "Light",
				},
				{
					weight: 300,
					style: "normal",
					name: "Semilight",
				},
				{
					weight: 400,
					style: "normal",
					name: "Book",
				},
				{
					weight: 450,
					style: "normal",
					name: "Regular",
				},
				{
					weight: 500,
					style: "normal",
					name: "Medium",
				},
				{
					weight: 700,
					style: "normal",
					name: "Bold",
				},
				{
					weight: 800,
					name: "Black",
				},
			]}
		/>
	</section>

	<section>
		<h2 id="tm-spec">tm-spec</h2>
		<p>My first typeface, formerly known as “sb-spec” and “sb-studio”.</p>
		<FontTester
			fontFamily="Spec"
			fontSize="48"
			fontStyles={[
				{
					weight: 100,
					style: "normal",
					name: "Hairline",
				},
				{
					weight: 200,
					style: "normal",
					name: "Thin",
				},
				{
					weight: 300,
					style: "normal",
					name: "Light",
				},
				{
					weight: 400,
					style: "normal",
					name: "Regular",
				},
				{
					weight: 500,
					style: "normal",
					name: "Medium",
				},
				{
					weight: 600,
					style: "normal",
					name: "Semibold",
				},
				{
					weight: 700,
					style: "normal",
					name: "Bold",
				},
			]}
		/>
	</section>
</article>

<style>
article {
	max-width: 100%;
	/* margin: 0 auto; */
}
</style>
