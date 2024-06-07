declare module "$env/static/public" {
	export const PUBLIC_SANITY_DATASET: string;
	export const PUBLIC_SANITY_PROJECT_ID: string;
	export const PUBLIC_SANITY_API_VERSION: string;
	export const PUBLIC_SANITY_STUDIO_URL: string;
}

declare module "$env/static/private" {
	export const SANITY_API_READ_TOKEN: string;
}
