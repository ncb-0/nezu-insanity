import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.L2gFam7c.js","_app/immutable/chunks/disclose-version.CuBZ2UMj.js","_app/immutable/chunks/runtime.BHE_jgcz.js","_app/immutable/chunks/props.DEeGB9ks.js","_app/immutable/chunks/store.EV_EhI1P.js","_app/immutable/chunks/index.BB0j7sDI.js","_app/immutable/chunks/stores.D18a2V27.js","_app/immutable/chunks/entry.DPh96igf.js","_app/immutable/chunks/index-client.B0NnqFmY.js","_app/immutable/chunks/each.SSPHf1Pv.js","_app/immutable/chunks/attributes.Dq7Nhvgo.js","_app/immutable/chunks/this.Wk-CpuXw.js","_app/immutable/chunks/svelte-element.C9nIUUil.js","_app/immutable/chunks/lifecycle.nE06RwnD.js"];
export const stylesheets = ["_app/immutable/assets/0.TJFL8XyF.css"];
export const fonts = [];
