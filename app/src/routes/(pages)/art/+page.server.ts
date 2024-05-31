import { artworksQuery as query, type Artwork } from "$lib/sanity/queries";
import { mediaQuery, type Tag } from "$lib/sanity/queries";
import { charactersQuery, type Tag } from "$lib/sanity/queries";
import { cwQuery, type Tag } from "$lib/sanity/queries";
import { yearsQuery, type Number } from "$lib/sanity/queries";
// import { combinedQuery as query, type QueryResult } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";
// import type { Tag, Artwork } from "$lib/sanity/queries";

export const load: PageServerLoad = async (event) => {
	try {
		const { loadQuery } = event.locals;

		let selectedCharacters: Tag[] = [];
		let selectedMedia: Tag[] = [];
		let selectedCW: Tag[] = [];
		let selectedYear: Number[] = [];

		const params = {
			selectedCharacters,
			selectedMedia,
			selectedCW,
			selectedYear,
		};

		const characters = await loadQuery<Tag[]>(charactersQuery);
		const media = await loadQuery<Tag[]>(mediaQuery);
		const cw = await loadQuery<Tag[]>(cwQuery);
		const year = await loadQuery<Number[]>(yearsQuery);
		const initial = await loadQuery<Artwork[]>(query, params);

		// const initial = await loadQuery<QueryResult>(query, params);

		// We pass the data in a format that is easy for `useQuery` to consume in the
		// corresponding `+page.svelte` file, but you can return the data in any
		// format you like.
		return {
			query,
			media,
			year,
			characters,
			cw,
			selectedCharacters,
			selectedMedia,
			selectedYear,
			selectedCW,
			params,
			options: { initial },
		};
	} catch (error) {
		console.error("Error loading data:", error);
		throw error;
	}
};
