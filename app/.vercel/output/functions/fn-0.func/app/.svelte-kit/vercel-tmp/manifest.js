export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","browserconfig.xml","favicon-16x16.png","favicon-32x32.png","favicon.ico","fonts/Helvetica/Helvetica-BoldOblique.woff2","fonts/Helvetica/Helvetica-Oblique.woff2","fonts/Helvetica/Helvetica.woff2","fonts/Helvetica/HelveticaBold.ttf","fonts/Helvetica/HelveticaBold.woff2","fonts/Job Clarendon Text/JobClarendonText-Bold.woff2","fonts/Job Clarendon Text/JobClarendonText-BoldItalic.woff2","fonts/Job Clarendon Text/JobClarendonText-Italic.woff2","fonts/Job Clarendon Text/JobClarendonText-Regular.woff2","fonts/Lagrange Mono/LagrangeMono-Italic.woff2","fonts/Lagrange Mono/LagrangeMono-Regular.woff2","fonts/River Mono/RiverMono-VF.ttf","fonts/River Mono/RiverMono-VF.woff2","fonts/TM/.DS_Store","fonts/TM/Mega/.DS_Store","fonts/TM/Mega/Mega-Black.ttf","fonts/TM/Mega/Mega-Black.woff","fonts/TM/Mega/Mega-Black.woff2","fonts/TM/Mega/Mega-Bold.ttf","fonts/TM/Mega/Mega-Bold.woff","fonts/TM/Mega/Mega-Bold.woff2","fonts/TM/Mega/Mega-Extralight.ttf","fonts/TM/Mega/Mega-Extralight.woff","fonts/TM/Mega/Mega-Extralight.woff2","fonts/TM/Mega/Mega-Hairline.ttf","fonts/TM/Mega/Mega-Hairline.woff","fonts/TM/Mega/Mega-Hairline.woff2","fonts/TM/Mega/Mega-Heavy.ttf","fonts/TM/Mega/Mega-Heavy.woff","fonts/TM/Mega/Mega-Heavy.woff2","fonts/TM/Mega/Mega-Light.ttf","fonts/TM/Mega/Mega-Light.woff","fonts/TM/Mega/Mega-Light.woff2","fonts/TM/Mega/Mega-Medium.ttf","fonts/TM/Mega/Mega-Medium.woff","fonts/TM/Mega/Mega-Medium.woff2","fonts/TM/Mega/Mega-Regular.ttf","fonts/TM/Mega/Mega-Regular.woff","fonts/TM/Mega/Mega-Regular.woff2","fonts/TM/Mega/Mega-Thin.ttf","fonts/TM/Mega/Mega-Thin.woff","fonts/TM/Mega/Mega-Thin.woff2","fonts/TM/PicoA/PicoA-Black.ttf","fonts/TM/PicoA/PicoA-Black.woff","fonts/TM/PicoA/PicoA-Black.woff2","fonts/TM/PicoA/PicoA-Bold.ttf","fonts/TM/PicoA/PicoA-Bold.woff","fonts/TM/PicoA/PicoA-Bold.woff2","fonts/TM/PicoA/PicoA-Book.ttf","fonts/TM/PicoA/PicoA-Book.woff","fonts/TM/PicoA/PicoA-Book.woff2","fonts/TM/PicoA/PicoA-Extralight.ttf","fonts/TM/PicoA/PicoA-Extralight.woff","fonts/TM/PicoA/PicoA-Extralight.woff2","fonts/TM/PicoA/PicoA-Hairline.ttf","fonts/TM/PicoA/PicoA-Hairline.woff","fonts/TM/PicoA/PicoA-Hairline.woff2","fonts/TM/PicoA/PicoA-Light.ttf","fonts/TM/PicoA/PicoA-Light.woff","fonts/TM/PicoA/PicoA-Light.woff2","fonts/TM/PicoA/PicoA-Medium.ttf","fonts/TM/PicoA/PicoA-Medium.woff","fonts/TM/PicoA/PicoA-Medium.woff2","fonts/TM/PicoA/PicoA-Regular.ttf","fonts/TM/PicoA/PicoA-Regular.woff","fonts/TM/PicoA/PicoA-Regular.woff2","fonts/TM/PicoA/PicoA-Semilight.ttf","fonts/TM/PicoA/PicoA-Semilight.woff","fonts/TM/PicoA/PicoA-Semilight.woff2","fonts/TM/PicoAMono/PicoAMono-Black.woff2","fonts/TM/PicoAMono/PicoAMono-Bold.woff2","fonts/TM/PicoAMono/PicoAMono-Book.woff2","fonts/TM/PicoAMono/PicoAMono-Extralight.woff2","fonts/TM/PicoAMono/PicoAMono-Hairline.woff2","fonts/TM/PicoAMono/PicoAMono-Light.woff2","fonts/TM/PicoAMono/PicoAMono-Medium.woff2","fonts/TM/PicoAMono/PicoAMono-Regular.woff2","fonts/TM/PicoAMono/PicoAMono-Semilight.woff2","fonts/TM/PicoB/PicoB-Black.ttf","fonts/TM/PicoB/PicoB-Black.woff","fonts/TM/PicoB/PicoB-Black.woff2","fonts/TM/PicoB/PicoB-Bold.ttf","fonts/TM/PicoB/PicoB-Bold.woff","fonts/TM/PicoB/PicoB-Bold.woff2","fonts/TM/PicoB/PicoB-Book.ttf","fonts/TM/PicoB/PicoB-Book.woff","fonts/TM/PicoB/PicoB-Book.woff2","fonts/TM/PicoB/PicoB-Extralight.ttf","fonts/TM/PicoB/PicoB-Extralight.woff","fonts/TM/PicoB/PicoB-Extralight.woff2","fonts/TM/PicoB/PicoB-Hairline.ttf","fonts/TM/PicoB/PicoB-Hairline.woff","fonts/TM/PicoB/PicoB-Hairline.woff2","fonts/TM/PicoB/PicoB-Light.ttf","fonts/TM/PicoB/PicoB-Light.woff","fonts/TM/PicoB/PicoB-Light.woff2","fonts/TM/PicoB/PicoB-Medium.ttf","fonts/TM/PicoB/PicoB-Medium.woff","fonts/TM/PicoB/PicoB-Medium.woff2","fonts/TM/PicoB/PicoB-Regular.ttf","fonts/TM/PicoB/PicoB-Regular.woff","fonts/TM/PicoB/PicoB-Regular.woff2","fonts/TM/PicoB/PicoB-Semilight.ttf","fonts/TM/PicoB/PicoB-Semilight.woff","fonts/TM/PicoB/PicoB-Semilight.woff2","fonts/TM/Spec/Spec-100.ttf","fonts/TM/Spec/Spec-100.woff","fonts/TM/Spec/Spec-100.woff2","fonts/TM/Spec/Spec-200.ttf","fonts/TM/Spec/Spec-200.woff","fonts/TM/Spec/Spec-200.woff2","fonts/TM/Spec/Spec-300.ttf","fonts/TM/Spec/Spec-300.woff","fonts/TM/Spec/Spec-300.woff2","fonts/TM/Spec/Spec-400.ttf","fonts/TM/Spec/Spec-400.woff","fonts/TM/Spec/Spec-400.woff2","fonts/TM/Spec/Spec-500.ttf","fonts/TM/Spec/Spec-500.woff","fonts/TM/Spec/Spec-500.woff2","fonts/TM/Spec/Spec-600.ttf","fonts/TM/Spec/Spec-600.woff","fonts/TM/Spec/Spec-600.woff2","fonts/TM/Spec/Spec-700.ttf","fonts/TM/Spec/Spec-700.woff","fonts/TM/Spec/Spec-700.woff2","img/lisa_nobg.png","img/nezureal.jpg","mstile-144x144.png","mstile-150x150.png","mstile-310x150.png","mstile-310x310.png","mstile-70x70.png","pdf/.DS_Store","pdf/24_32.pdf","pdf/mm_preview.pdf","robots.txt","safari-pinned-tab.svg","ui/bg-dark-purple.svg","ui/bg-dark.svg","ui/bg-white.svg","ui/bg.svg","ui/flowers-bottom-dark-purple.svg","ui/flowers-bottom-dark.svg","ui/flowers-bottom-purple.svg","ui/flowers-bottom.svg","ui/flowers-top-dark-purple.svg","ui/flowers-top-dark.svg","ui/flowers-top-purple.svg","ui/flowers-top.svg"]),
	mimeTypes: {".png":"image/png",".xml":"text/xml",".woff2":"font/woff2",".ttf":"font/ttf",".woff":"font/woff",".jpg":"image/jpeg",".pdf":"application/pdf",".txt":"text/plain",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.CEohGHO0.js","app":"_app/immutable/entry/app.BVFGRrEb.js","imports":["_app/immutable/entry/start.CEohGHO0.js","_app/immutable/chunks/entry.DPh96igf.js","_app/immutable/chunks/index-client.B0NnqFmY.js","_app/immutable/chunks/runtime.BHE_jgcz.js","_app/immutable/chunks/index.BB0j7sDI.js","_app/immutable/entry/app.BVFGRrEb.js","_app/immutable/chunks/preload-helper.D7HrI6pR.js","_app/immutable/chunks/runtime.BHE_jgcz.js","_app/immutable/chunks/disclose-version.CuBZ2UMj.js","_app/immutable/chunks/props.DEeGB9ks.js","_app/immutable/chunks/svelte-component.BF6NcL9n.js","_app/immutable/chunks/this.Wk-CpuXw.js","_app/immutable/chunks/index-client.B0NnqFmY.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
