import { client } from "$lib/sanity/client";
import { SANITY_API_READ_TOKEN } from "$env/static/private";

export const serverClient = client.withConfig({
	token: SANITY_API_READ_TOKEN,
	useCdn: true,
	stega: true,
});
