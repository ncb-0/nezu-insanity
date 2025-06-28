import { postsQuery, type Post } from "$lib/sanity/queries";
import { tagsQuery, type Tag } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const initial = await loadQuery<Post[]>(postsQuery, {
		lang: event.params.lang || "en",
	});
	const tags = await loadQuery<Tag[]>(tagsQuery);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		postsQuery,
		tagsQuery,
		tags,
		options: { initial },
	};
};
