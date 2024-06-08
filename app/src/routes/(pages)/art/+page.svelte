<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import Card from "$lib/components/Card.svelte";
import { useQuery } from "@sanity/svelte-loader";
import { ssp, queryParam, queryParameters } from "sveltekit-search-params";
import type { PageData } from "./$types";
export let data: PageData;

$: q = useQuery(data);

$: ({ data: artworks } = $q);

$: c = queryParam("c");
$: m = queryParam("m");
$: y = queryParam("y");
$: t = queryParam("t");

$: console.log($y);

// let selectedCharacters: Tag[] = [];
// let selectedMedia: Tag[] = [];
// let selectedCW: Tag[] = [];
// let selectedYear: Number[] = [];

// $: selectedCharacters = $c || "";
// $: selectedMedia = $m || "";
// $: selectedYear = $y || "";
// $: selectedCW = $t || "";

// $: params = {
// 	selectedCharacters,
// 	selectedMedia,
// 	selectedYear,
// 	selectedCW,
// };

$: checkCharacterMatch = (artwork) => {
	return (
		$c?.length === 0 ||
		(artwork.characters &&
			artwork.characters.some((character) => {
				return $c?.includes(character._key);
			}))
	);
};

$: checkMediaMatch = (artwork) => {
	return (
		$m?.length === 0 ||
		(artwork.media &&
			artwork.media.some((media) => {
				return $m?.includes(media._key);
			}))
	);
};

$: checkCWMatch = (artwork) => {
	return (
		$t?.length === 0 ||
		(artwork.cw &&
			artwork.cw.some((cw) => {
				return $t?.includes(cw._key);
			}))
	);
};

$: checkYearMatch = (artwork) => {
	return (
		$y?.length === 0 ||
		(artwork.year &&
			artwork.year.some((year) => {
				return $y?.includes(year);
			}))
	);
};
</script>

<svelte:head>
	<title>gallery | nezu.world</title>
	<meta property="og:title" content="gallery | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Art by Lisa M" />
	<meta property="og:description" content="Art by Lisa M." />
	<meta property="og:url" content="https://nezu.world/{data.currentURL}" />
	<meta property="og:site_name" content="nezu.world" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="gallery | nezu.world" />
	<meta name="twitter:description" content="Art by Lisa M" />
	<meta name="twitter:description" content="Art by Lisa M." />
	<meta name="twitter:url" content="https://nezu.world/{data.currentURL}" />
	<meta name="twitter:site" content="@ncb0_" />
	<meta name="twitter:creator" content="@ncb0_" />
	<meta
		property="og:image"
		content="https://nezu.world/icon/android-chrome-512x512.png"
	/>
	<meta
		property="twitter:image"
		content="https://nezu.world/icon/android-chrome-512x512.png"
	/>
</svelte:head>

<article>
	<section>
		<h1>gallery</h1>
	</section>

	<!-- <CardGrid items={artworks} baseURL="art/{artworks[0].year}" /> -->

	<section>
		<h2>filters</h2>
		<div class="options">
			<div>
				<label for="year">year</label>
				<select name="Year" id="year" multiple size="0" bind:value={$y}>
					<option disabled selected label="select">(select year)</option>

					{#each data.year.data as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="media">media</label>
				<select name="Media" id="media" multiple size="0" bind:value={$m}>
					<option disabled selected label="select">(select media)</option>

					{#each data.media.data as medium}
						<option value={medium}>{medium}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="characters">characters</label>
				<select
					name="Characters"
					id="characters"
					multiple
					size="0"
					bind:value={$c}
				>
					<option disabled selected label="select">(select characters)</option>

					{#each data.characters.data as character}
						<option value={character}>{character}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="cw">content warnings</label>
				<select
					name="Content Warnings"
					id="cw"
					multiple
					size="0"
					bind:value={$t}
				>
					<option disabled selected label="select"
						>(select content warnings)</option
					>

					{#each data.cw.data as cw}
						<option value={cw}>{cw}</option>
					{/each}
				</select>
			</div>
		</div>
	</section>

	<section data-sveltekit-preload-data="hover">
		<div class="card-grid">
			{#each data.options.initial.data as artwork}
				{#if checkYearMatch(artwork)}
					{#if artwork.nsfw == true}
						<Card
							item={artwork}
							baseURL="art/{artwork.year}"
							text="false"
							nsfw="true"
						/>
					{:else}
						<Card item={artwork} baseURL="art/{artwork.year}" text="false" />
					{/if}
				{/if}
			{/each}
		</div>
	</section>

	<!-- <section data-sveltekit-preload-data="hover">
		<div class="card-grid">
			{#each filteredArtworks as artwork}
				{#if artwork.nsfw == true}
					<Card
						item={artwork}
						baseURL="art/{artwork.year}"
						text="false"
						nsfw="true"
					/>
				{:else}
					<Card item={artwork} baseURL="art/{artwork.year}" text="false" />
				{/if}
			{/each}
		</div>
	</section> -->
</article>

<style>
article {
	max-width: 100%;
	/* margin: 0 auto; */
}
.options {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	/* grid-auto-flow: column; */
	gap: 0.5rem;
}
label {
	font-size: 1.5rem;
	line-height: 1.75ex;
	font-family: var(--font-sans);
	font-weight: 700;
}
select {
	font-family: var(--font-mono) !important;
	background: rgb(var(--bg-color));
	border: 1px solid rgb(var(--text-color), 0.3);
	/* border: none; */
	padding: 0;
	color: rgb(var(--text-color));
	border-radius: 0;
	display: block;
	width: 100%;
	font-size: 1rem;
}
select option:disabled {
	color: rgba(var(--text-color), 0.4);
	display: none;
}
select option:hover {
	background: rgb(var(--text-color), 0.2);
	color: rgb(var(--text-color));
}

select[multiple]:focus option:checked {
	background: rgb(var(--text-color))
		linear-gradient(
			0deg,
			rgb(var(--text-color)) 0%,
			rgb(var(--text-color)) 100%
		);
	color: rgb(var(--bg-color)) !important;
}
select option:checked,
select option:focus,
select option:active select,
option[selected] {
	background: rgb(var(--text-color), 1);
	color: rgb(var(--bg-color));
	font-weight: 700;
}
</style>
