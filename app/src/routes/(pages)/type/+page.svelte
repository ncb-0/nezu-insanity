<script>
import FontTester from "$lib/components/FontTester.svelte";
export let data;
</script>

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
		<h2>tm-lagrange-mono</h2>
		<p>A monospaced clarendon.</p>
		<FontTester
			fontFamily="Lagrange Mono"
			fontSize="48"
			fontStyles={[
				{
					value: "normal",
					name: "Regular",
				},
				{
					value: "italic",
					name: "Italic",
				},
			]}
		/>
	</section>

	<section>
		<h2>tm-mega</h2>
		<p>
			A sturdy sans serif with superelliptical curves and a Frutigerian flair.
			Mega supports Latin Plus (incl. Pinyin & Vietnamese), extended Cyrillic,
			and polytonic Greek. 9000+ kerning pairs.
		</p>
		<FontTester
			fontFamily="Mega"
			fontSize="48"
			fontWeights={[
				{
					weight: 100,
					name: "Hairline",
				},
				{
					weight: 200,
					name: "Extralight",
				},
				{
					weight: 300,
					name: "Thin",
				},
				{
					weight: 400,
					name: "Light",
				},
				{
					weight: 500,
					name: "Regular",
				},
				{
					weight: 600,
					name: "Medium",
				},
				{
					weight: 700,
					name: "Bold",
				},
				{
					weight: 800,
					name: "Heavy",
				},
				{
					weight: 900,
					name: "Black",
				},
			]}
		/>
	</section>

	<section>
		<h2>tm-pico</h2>
		<p>
			A cute sans-serif with a crude geometric feel and minimal optical
			corrections. Pico supports Latin Plus (incl. Pinyin & Vietnamese) and
			basic Cyrillic.
		</p>
		<h3>tm-pico-A</h3>
		<p>Non-rounded variant.</p>
		<FontTester
			fontFamily="Pico A"
			fontSize="48"
			fontWeights={[
				{
					weight: 100,
					name: "Hairline",
				},
				{
					weight: 200,
					name: "Extralight",
				},
				{
					weight: 300,
					name: "Light",
				},
				{
					weight: 400,
					name: "Semilight",
				},
				{
					weight: 500,
					name: "Book",
				},
				{
					weight: 600,
					name: "Regular",
				},
				{
					weight: 700,
					name: "Medium",
				},
				{
					weight: 800,
					name: "Bold",
				},
				{
					weight: 900,
					name: "Black",
				},
			]}
		/>

		<h3>tm-pico-B</h3>
		<p>Rounded variant.</p>
		<FontTester
			fontFamily="Pico B"
			fontSize="48"
			fontWeights={[
				{
					weight: 100,
					name: "Hairline",
				},
				{
					weight: 200,
					name: "Extralight",
				},
				{
					weight: 300,
					name: "Light",
				},
				{
					weight: 400,
					name: "Semilight",
				},
				{
					weight: 500,
					name: "Book",
				},
				{
					weight: 600,
					name: "Regular",
				},
				{
					weight: 700,
					name: "Medium",
				},
				{
					weight: 800,
					name: "Bold",
				},
				{
					weight: 900,
					name: "Black",
				},
			]}
		/>
	</section>

	<section>
		<h2>tm-spec</h2>
		<p>My first typeface, formerly known as “sb-spec” and “sb-studio”.</p>
		<FontTester
			fontFamily="Spec"
			fontSize="48"
			fontWeights={[
				{
					weight: 100,
					name: "Hairline",
				},
				{
					weight: 200,
					name: "Thin",
				},
				{
					weight: 300,
					name: "Light",
				},
				{
					weight: 400,
					name: "Regular",
				},
				{
					weight: 500,
					name: "Medium",
				},
				{
					weight: 600,
					name: "Semibold",
				},
				{
					weight: 700,
					name: "Bold",
				},
			]}
		/>
	</section>
</article>

<style>
article {
	max-width: 100vw;
	/* margin: 0 auto; */
}
</style>