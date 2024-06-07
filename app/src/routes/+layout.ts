import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";
// import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

// injectSpeedInsights();

// lalala!

inject({ mode: dev ? "development" : "production" });

// export const prerender = false;

export async function load({ url }) {
	let currentURL = url.pathname;

	return { currentURL };
}
