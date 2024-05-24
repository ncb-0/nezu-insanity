export const prerender = false;

export async function load({ url }) {
	let currentURL = url.pathname;

	return { currentURL };
}
