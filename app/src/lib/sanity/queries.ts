import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(title asc) | order(date desc)`;

export const taggedPostsQuery = groq`*[_type == "post" && myTags[].value match $tag && defined(slug.current)]|order(slug.current asc){
  "slug": slug.current,
  title,
  shortTitle,
}`;

export const tagQuery = groq`*[myTags[].value match $tag]`;

export const tagsQuery = groq`array::unique(*[defined(myTags)].myTags[]|order(_key asc)._key)`;

export interface Post {
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
}

export interface Tag {
	_type: "tag";
	label: string;
	_key: string;
	value: string;
	slug: Slug;
}
