<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import Card from "$lib/components/Card.svelte";
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";

import type { Tag } from "$lib/sanity/queries";

interface Props {
	data: PageData;
}

let { data }: Props = $props();

// const test = queryParam("test");

let q = $derived(useQuery(data));

let { data: artworks } = $derived($q);

let selectedCharacters: Tag[] = [];
let selectedMedia: Tag[] = [];
let selectedCW: Tag[] = [];
let selectedYear: Number[] = [];

const params = $state({
	selectedCharacters,
	selectedMedia,
	selectedCW,
	selectedYear,
});

$inspect({ params });

const checkCharacterMatch = (artwork) => {
	return (
		params.selectedCharacters.length === 0 ||
		(artwork.characters &&
			artwork.characters.some((character) => {
				return params.selectedCharacters.includes(character._key);
			}))
	);
};

const checkMediaMatch = (artwork) => {
	return (
		params.selectedMedia.length === 0 ||
		(artwork.media &&
			artwork.media.some((media) => {
				return params.selectedMedia.includes(media._key);
			}))
	);
};

const checkCWMatch = (artwork) => {
	return (
		params.selectedCW.length === 0 ||
		(artwork.cw &&
			artwork.cw.some((cw) => {
				return params.selectedCW.includes(cw._key);
			}))
	);
};

const checkYearMatch = (artwork) => {
	return (
		params.selectedYear.length === 0 ||
		(Array.isArray(artwork.year) &&
			artwork.year.some((year) => {
				return params.selectedYear.includes(year);
			})) ||
		(!Array.isArray(artwork.year) && params.selectedYear.includes(artwork.year))
	);
};

const filterArtworks = (artworks) => {
	return artworks.filter((artwork) => {
		return (
			checkCharacterMatch(artwork) &&
			checkMediaMatch(artwork) &&
			checkYearMatch(artwork) &&
			checkCWMatch(artwork)
		);
	});
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
				<select
					name="Year"
					id="year"
					multiple
					size="0"
					bind:value={params.selectedYear}
				>
					<option disabled selected label="select">(select year)</option>

					{#await data.year}
						<option value="loading" disabled>loading…</option>
					{:then years}
						{#each years.data as year}
							<option value={year}>{year}</option>
						{/each}
					{/await}
				</select>
			</div>
			<div>
				<label for="media">media</label>
				<select
					name="Media"
					id="media"
					multiple
					size="0"
					bind:value={params.selectedMedia}
				>
					<option disabled selected label="select">(select media)</option>

					{#await data.media}
						<option value="loading" disabled>loading…</option>
					{:then media}
						{#each media.data as medium}
							<option value={medium}>{medium}</option>
						{/each}
					{/await}
				</select>
			</div>
			<div>
				<label for="characters">characters</label>
				<select
					name="Characters"
					id="characters"
					multiple
					size="0"
					bind:value={params.selectedCharacters}
				>
					<option disabled selected label="select">(select characters)</option>

					{#await data.characters}
						<option value="loading" disabled>loading…</option>
					{:then characters}
						{#each characters.data as character}
							<option value={character}>{character}</option>
						{/each}
					{/await}
				</select>
			</div>
			<div>
				<label for="cw">content warnings</label>
				<select
					name="Content Warnings"
					id="cw"
					multiple
					size="0"
					bind:value={params.selectedCW}
				>
					<option disabled selected label="select"
						>(select content warnings)</option
					>

					{#await data.cw}
						<option value="loading" disabled>loading…</option>
					{:then cws}
						{#each cws.data as cw}
							<option value={cw}>{cw}</option>
						{/each}
					{/await}
				</select>
			</div>
		</div>
	</section>

	<section data-sveltekit-preload-data="hover">
		<div class="card-grid">
			{#await data.options.initial}
				<p>loading…</p>
			{:then artworks}
				{#each artworks.data as artwork}
					{#if checkYearMatch(artwork) && checkCharacterMatch(artwork) && checkMediaMatch(artwork) && checkCWMatch(artwork)}
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
			{/await}
		</div>
	</section>
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
