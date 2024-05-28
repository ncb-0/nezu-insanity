<script lang="ts">
import CardGrid from "$lib/components/CardGrid.svelte";
import Card from "$lib/components/Card.svelte";
import { useQuery } from "@sanity/svelte-loader";
import type { PageData } from "./$types";
export let data: PageData;

$: q = useQuery(data);

$: ({ data: artworks } = $q);

$: filteredArtworks = data.options.initial.data.filter((artwork) => {
	// Check if no characters are selected or if there is a character match
	const characterMatch =
		data.params.selectedCharacters.length === 0 ||
		(artwork.characters &&
			artwork.characters.some((character) => {
				return data.params.selectedCharacters.includes(character._key);
			}));

	// Check if no media are selected or if there is a media match
	const mediaMatch =
		data.params.selectedMedia.length === 0 ||
		(artwork.media &&
			artwork.media.some((media) => {
				return data.params.selectedMedia.includes(media._key);
			}));

	// Check if the artwork year matches the selected year
	const yearMatch =
		data.params.selectedYear.length === 0 ||
		(Array.isArray(artwork.year) &&
			artwork.year.some((year) => {
				return data.params.selectedYear.includes(year);
			})) ||
		(!Array.isArray(artwork.year) &&
			data.params.selectedYear.includes(artwork.year));

	// Return true if both character and media match, and year matches
	return characterMatch && mediaMatch && yearMatch;
});
</script>

<svelte:head>
	<title>gallery | nezu.world</title>
	<meta property="og:title" content="gallery | nezu.world" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://v2.nezu.world/{data.currentURL}" />
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
					bind:value={data.params.selectedYear}
				>
					<option disabled selected label="select">(select year)</option>

					{#each data.year.data as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="media">media</label>
				<select
					name="Media"
					id="media"
					multiple
					size="0"
					bind:value={data.params.selectedMedia}
				>
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
					bind:value={data.params.selectedCharacters}
				>
					<option disabled selected label="select">(select characters)</option>

					{#each data.characters.data as character}
						<option value={character}>{character}</option>
					{/each}
				</select>
			</div>
			<!-- <div>
				<label for="cw">content warnings</label>
				<select
					name="Content Warnings"
					id="cw"
					multiple
					size="0"
					bind:value={data.params.selectedCW}
				>
					<option disabled selected label="select"
						>(select content warnings)</option
					>

					{#each data.cw.data as cw}
						<option value={cw}>{cw}</option>
					{/each}
				</select>
			</div> -->
		</div>
	</section>

	<section>
		<div class="card-grid">
			{#each filteredArtworks as artwork}
				<Card item={artwork} baseURL="art/{artwork.year}" text="false" />
			{/each}
		</div>
	</section>
</article>

<style>
article {
	max-width: 100vw;
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
	border: 1px solid rgb(var(--text-color), 0.2);
	/* border: none; */
	padding: 0;
	color: rgb(var(--text-color));
	border-radius: 0;
	display: block;
	width: 100%;
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
