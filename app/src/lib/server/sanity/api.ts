import { SANITY_API_READ_TOKEN } from "$env/static/private";
import { assertEnvVar } from "$lib/sanity/api";

export const token = SANITY_API_READ_TOKEN;
