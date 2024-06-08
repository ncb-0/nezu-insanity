import { tagQuery as query, type Tag } from "$lib/sanity/queries";
import { blogTagQuery, type Tag } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const { tag } = event.params;

	const params = { tag };
	const initial = await loadQuery<Tag>(query, params);
	const blogPosts = await loadQuery<Tag>(blogTagQuery, params);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		params,
		blogPosts,
		options: { initial },
	};
};
