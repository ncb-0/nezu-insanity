import { client } from "$lib/sanity/client";
import { token } from "$lib/server/sanity/api";
import { SANITY_API_READ_TOKEN } from "$env/static/private";

export const serverClient = client.withConfig({
	token: SANITY_API_READ_TOKEN,
	useCdn: true,
	stega: true,
});
