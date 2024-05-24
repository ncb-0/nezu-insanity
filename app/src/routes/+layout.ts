import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";

inject({ mode: dev ? "development" : "production" });

export const prerender = false;

export async function load({ url }) {
	let currentURL = url.pathname;

	return { currentURL };
}
