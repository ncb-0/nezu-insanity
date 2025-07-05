import { blogsQuery as query, type BlogPost } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;

	const initial = await loadQuery<BlogPost[]>(query, {
		lang: event.params.lang || "en",
	});

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		options: { initial },
	};
};
