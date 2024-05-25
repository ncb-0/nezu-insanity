import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current) && !(myTags[].value match "subpage") && !(myTags[].value match "testing")] | order(title asc) | order(date desc)`;

export const taggedPostsQuery = groq`*[_type == "post" && myTags[].value match $tag && defined(slug.current)]|order(slug.current asc){
  slug,
  title,
  shortTitle,
}`;

export const childrenQuery = groq`*[_type == "post" && defined(children) && slug.current == $slug].children[]->{
  title, 
  shortTitle, 
	slug, 
  mainImage,
	children,
}`;

export const parentsQuery = groq`*[_type == "post" && defined(slug.current) && slug.current == $slug]{
  "parent": *[references(^._id)]{
  title, 
  shortTitle, 
  slug, 
  mainImage
}}`;

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
	children?: Array<Post>;
}

export interface Tag {
	_type: "tag";
	label: string;
	_key: string;
	value: string;
	slug: Slug;
}
