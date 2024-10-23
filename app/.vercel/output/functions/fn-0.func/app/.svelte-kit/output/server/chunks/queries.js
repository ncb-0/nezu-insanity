import groq from "groq";
const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;
const postsQuery = groq`*[_type == "post" 
  && defined(slug.current)
	&& myTags[].value match "work"
  && !(myTags[].value match "subpage") 
  && !(myTags[].value match "testing")] 
       | order(title asc) 
       | order(date desc){
    title, shortTitle, mainImage, slug
  }`;
const blogQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]`;
const blogsQuery = groq`*[_type == "blogPost" && defined(slug.current)] | order(_createdAt desc){
    title, shortTitle, mainImage, slug, date, year, _createdAt, excerpt
  }`;
const artworksQuery = groq`*[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc){ title, shortTitle, mainImage, slug, media, characters, year, date, cw, nsfw }`;
const artworksCompactQuery = groq`*[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc){ title, shortTitle, mainImage, slug, date, year, nsfw }`;
const artworksYearQuery = groq`*[_type == "artwork" && defined(slug.current) && year == $year] | order(title asc) | order(date desc)`;
const artworkQuery = groq`*[_type == "artwork" && slug.current == $slug][0]`;
groq`*[_type == "post" && myTags[].value match $tag && defined(slug.current)] | order(slug.current asc){
  slug,
  title,
  shortTitle,
}`;
const childrenQuery = groq`*[_type == "post" && defined(children) && slug.current == $slug].children[]->{
  title, 
  shortTitle, 
	slug, 
  mainImage,
}`;
const parentsQuery = groq`*[_type == "post" && defined(slug.current) && slug.current == $slug]{
  "parent": *[references(^._id)]{
  title, 
  shortTitle, 
  slug, 
  mainImage
}}`;
const tagQuery = groq`*[_type == "post" && myTags[].value match $tag] | order(slug.current asc){
  title, shortTitle, mainImage, slug, myTags
  }`;
const blogTagQuery = groq`*[_type == "blogPost" && myTags[].value match $tag] | order(slug.current asc){
  title, shortTitle, mainImage, slug, date, year, _createdAt, excerpt, myTags,
  }`;
const tagsQuery = groq`array::unique(*[defined(myTags)].myTags[] | order(_key asc)._key)`;
const mediaQuery = groq`array::unique(*[defined(media)].media[]._key | order(_key asc))`;
const yearsQuery = groq`array::unique(*[_type == "artwork" && defined(year)].year | order(year asc))`;
const charactersQuery = groq`array::unique(*[defined(characters)].characters[]._key | order(_key desc))`;
const cwQuery = groq`array::unique(*[defined(cw)].cw[]._key | order(_key asc))`;
groq`{
  tags: array::unique(*[_type == "post" && defined(myTags)].myTags[] | order(_key asc)._key),
  media: array::unique(*[defined(media)].media[]._key | order(_key asc)),
  years: array::unique(*[_type == "artwork" && defined(year)].year | order(year asc)),
  characters: array::unique(*[defined(characters)].characters[]._key | order(_key desc)),
  cw: array::unique(*[defined(cw)].cw[]._key | order(_key asc)),
  artworks: *[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc){ title, shortTitle, mainImage, slug, media, characters, year, date, cw, nsfw }
}`;
export {
  artworksCompactQuery as a,
  blogsQuery as b,
  charactersQuery as c,
  cwQuery as d,
  artworksQuery as e,
  artworksYearQuery as f,
  artworkQuery as g,
  blogQuery as h,
  tagQuery as i,
  blogTagQuery as j,
  postQuery as k,
  childrenQuery as l,
  mediaQuery as m,
  parentsQuery as n,
  postsQuery as p,
  tagsQuery as t,
  yearsQuery as y
};
