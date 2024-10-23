import { t as tagsQuery, b as blogsQuery, a as artworksCompactQuery, p as postsQuery } from "../../chunks/queries.js";
const load = async (event) => {
  const { loadQuery } = event.locals;
  let selectedCharacters = [];
  let selectedMedia = [];
  let selectedCW = [];
  let selectedYear = [];
  const params = {
    selectedCharacters,
    selectedMedia,
    selectedCW,
    selectedYear
  };
  return {
    params,
    tags: await loadQuery(tagsQuery),
    blogPosts: await loadQuery(blogsQuery),
    artworks: await loadQuery(artworksCompactQuery, params),
    options: { initial: await loadQuery(postsQuery) }
  };
};
export {
  load
};
