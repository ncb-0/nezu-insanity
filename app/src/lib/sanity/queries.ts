import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

// export const postsQuery = groq`*[_type == "post" && defined(slug.current) && !(myTags[].value match "subpage") && !(myTags[].value match "testing")] | order(title asc) | order(date desc)`;

export const postsQuery = groq`*[_type == "post" 
  && defined(slug.current)
	&& (language == "en" || !defined(language))
	&& myTags[].value match "work"
  && !(myTags[].value match "subpage") 
  && !(myTags[].value match "testing")] 
       | order(title asc) 
       | order(date desc){
    title, shortTitle, mainImage, slug
  }`;

export const blogQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]`;

export const blogsQuery = groq`*[_type == "blogPost" && defined(slug.current) && (language == "en" || !defined(language))] | order(_createdAt desc){
    title, shortTitle, mainImage, slug, date, year, _createdAt, excerpt
  }`;

// export const artworksQuery = groq`*[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc)`;

export const artworksQuery = groq`*[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc){ title, shortTitle, mainImage, slug, media, characters, year, date, cw, nsfw }`;

export const artworksCompactQuery = groq`*[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc){ title, shortTitle, mainImage, slug, date, year, nsfw }`;

export const artworksYearQuery = groq`*[_type == "artwork" && defined(slug.current) && year == $year] | order(title asc) | order(date desc)`;

export const artworkQuery = groq`*[_type == "artwork" && slug.current == $slug][0]`;

export const taggedPostsQuery = groq`*[_type == "post" && myTags[].value match $tag && defined(slug.current) && (language == "en" || !defined(language))] | order(slug.current asc){
  slug,
  title,
  shortTitle,
}`;

export const childrenQuery = groq`*[_type == "post" && defined(children) && slug.current == $slug && (language == "en" || !defined(language))].children[]->{
  title, 
  shortTitle, 
	slug, 
  mainImage,
}`;

export const parentsQuery = groq`*[_type == "post" && defined(slug.current) && slug.current == $slug && (language == "en" || !defined(language))]{
  "parent": *[references(^._id)]{
  title, 
  shortTitle, 
  slug, 
  mainImage
}}`;

// export const tagQuery = groq`*[_type == "post" && myTags[].value match $tag] | order(slug.current asc)`;

export const tagQuery = groq`*[_type == "post" && myTags[].value match $tag && (language == "en" || !defined(language))] | order(slug.current asc){
  title, shortTitle, mainImage, slug, myTags
  }`;

export const blogTagQuery = groq`*[_type == "blogPost" && myTags[].value match $tag && (language == "en" || !defined(language))] | order(slug.current asc){
  title, shortTitle, mainImage, slug, date, year, _createdAt, excerpt, myTags,
  }`;

export const tagsQuery = groq`array::unique(*[defined(myTags)].myTags[] | order(_key asc)._key)`;

export const mediaQuery = groq`array::unique(*[defined(media)].media[]._key | order(_key asc))`;

export const yearsQuery = groq`array::unique(*[_type == "artwork" && defined(year)].year | order(year asc))`;

export const charactersQuery = groq`array::unique(*[defined(characters)].characters[]._key | order(_key desc))`;

export const cwQuery = groq`array::unique(*[defined(cw)].cw[]._key | order(_key asc))`;

export const combinedQuery = groq`{
  tags: array::unique(*[_type == "post" && defined(myTags)].myTags[] | order(_key asc)._key),
  media: array::unique(*[defined(media)].media[]._key | order(_key asc)),
  years: array::unique(*[_type == "artwork" && defined(year)].year | order(year asc)),
  characters: array::unique(*[defined(characters)].characters[]._key | order(_key desc)),
  cw: array::unique(*[defined(cw)].cw[]._key | order(_key asc)),
  artworks: *[_type == "artwork" && defined(slug.current) && media[].label match $selectedMedia && characters[].label match $selectedCharacters] | order(title asc) | order(date desc){ title, shortTitle, mainImage, slug, media, characters, year, date, cw, nsfw }
}`;

export interface Page {
	_type: "post";
	_createdAt: string;
	year?: number;
	date: Date;
	title: string;
	shortTitle: string;
	slug: Slug;
	excerpt?: string;
	mainImage?: ImageAsset;
	body: PortableTextBlock[];
	children?: Array<Post>;
}

export interface Post {
	_type: "post";
	_createdAt: string;
	year?: number;
	myTags?: Array<Object>;
	date: Date;
	title: string;
	shortTitle: string;
	slug: Slug;
	excerpt?: string;
	mainImage?: ImageAsset;
	body: PortableTextBlock[];
	children?: Array<Post>;
}

export interface BlogPost {
	shortTitle: string;
	_type: "post";
	_createdAt: string;
	year?: number;
	myTags?: Array<Object>;
	date: Date;
	title: string;
	slug: Slug;
	excerpt?: string;
	mainImage?: ImageAsset;
	body: PortableTextBlock[];
	children?: Array<Post>;
}

export interface Tag {
	_type: "tag";
	label: string;
	_key: string;
	value: string;
	slug: Slug;
}

export interface Artwork {
	_type: "artwork";
	_createdAt: string;
	year: number;
	myTags?: Array<Tag>;
	date: Date;
	title: string;
	slug: Slug;
	mainImage: ImageAsset;
	media?: Array<Tag>;
	characters?: Array<Tag>;
	cw?: Array<Tag>;
	nsfw?: boolean;
}

export interface QueryResult {
	media: Array<Tag>;
	years: Array<Number>;
	characters: Array<Tag>;
	cw: Array<Tag>;
	artworks: Array<Artwork>;
}
