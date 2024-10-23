import adapter from "@sveltejs/adapter-vercel";
import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter({
			split: true,
		}),
		paths: {
			relative: false,
		},
		prerender: {
			handleHttpError: "warn",
		},
		files: {
			assets: "static",
		},
	},
};

export default config;
