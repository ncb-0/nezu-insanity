import { postQuery as query, type Post } from "$lib/sanity/queries";
import { childrenQuery, type Post } from "$lib/sanity/queries";
import { parentsQuery, type Post } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const { slug } = event.params;

	const params = { slug, lang: event.params.lang || "en" };
	const initial = await loadQuery<Post>(query, params);
	const children = await loadQuery<Post>(childrenQuery, params);
	const parents = await loadQuery<Post>(parentsQuery, params);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		childrenQuery,
		children,
		parentsQuery,
		parents,
		params,
		options: { initial },
	};
};
