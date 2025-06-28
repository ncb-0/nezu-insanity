import { artworksYearQuery as query, type Artwork } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const { year } = event.params;

	const params = { year: parseInt(year) };

	const initial = await loadQuery<Artwork[]>(query, params);

	return {
		query,
		params,
		options: { initial },
	};
};
