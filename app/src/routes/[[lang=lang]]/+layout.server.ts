import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = (event) => {
	const { lang } = event.params;
	if (!lang || lang === "en") {
		console.log("lang is empty or en");
		return { lang: "en" };
	} else {
		console.log("lang is not empty or en");
		return { lang };
	}
};
