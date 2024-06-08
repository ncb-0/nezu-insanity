import { artworksQuery as query, type Artwork } from "$lib/sanity/queries";
import { mediaQuery, type Tag } from "$lib/sanity/queries";
import { charactersQuery, type Tag } from "$lib/sanity/queries";
import { cwQuery, type Tag } from "$lib/sanity/queries";
import { yearsQuery, type Number } from "$lib/sanity/queries";
// import { combinedQuery as query, type QueryResult } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";
// import type { Tag, Artwork } from "$lib/sanity/queries";

export const load: PageServerLoad = async (event) => {
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

	// const characters = loadQuery<Tag[]>(charactersQuery);
	// const media = loadQuery<Tag[]>(mediaQuery);
	// const cw = loadQuery<Tag[]>(cwQuery);
	// const year = loadQuery<Number[]>(yearsQuery);
	// const initial = await loadQuery<Artwork[]>(query, params);

	// const initial = await loadQuery<QueryResult>(query, params);

	return {
		params,
		media: await loadQuery<Tag[]>(mediaQuery),
		year: await loadQuery<Number[]>(yearsQuery),
		characters: await loadQuery<Tag[]>(charactersQuery),
		cw: await loadQuery<Tag[]>(cwQuery),
		options: { initial: await loadQuery<Artwork[]>(query, params) },
	};
};
