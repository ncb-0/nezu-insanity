import { postsQuery, type Post } from "$lib/sanity/queries";
import { blogsQuery, type BlogPost } from "$lib/sanity/queries";
import { tagsQuery, type Tag } from "$lib/sanity/queries";
import { artworksCompactQuery, type Artwork } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";

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

	// const artworks = await loadQuery<Artwork[]>(artworksQuery, params);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		tags: await loadQuery<Tag[]>(tagsQuery),
		blogPosts: await loadQuery<BlogPost[]>(blogsQuery),
		artworks: await loadQuery<Artwork[]>(artworksCompactQuery, params),
		options: { initial: await loadQuery<Post[]>(postsQuery) },
	};
};
