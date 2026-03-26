import { client } from "$lib/sanity/client";
import { blogsQuery } from "$lib/sanity/queries";
import groq from "groq";
import RSS from "rss";

export async function GET() {
	const feed = new RSS({
		title: "nezu.world blog",
		site_url: "https://nezu.world",
		feed_url: "https://nezu.world/rss.xml",
	});

	const posts = await client.fetch(blogsQuery);

	for (const post of posts)
		feed.item({
			title: post.title,
			description: post.excerpt,
			date: post.date,
			url: `https://nezu.world/blog/${post.slug.current}`,
			author: "lisa m",
			categories: post.myTags.map((_) => _.value),
		});

	return new Response(feed.xml({ indent: true }), {
		status: 200,
		headers: {
			"Content-Type": "application/xml",
		},
	});
}
