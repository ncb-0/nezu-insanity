import { c as client } from "./client.js";
import { a as unstable__serverClient, l as loadQuery, s as setServerClient } from "./createQueryStore.js";
import { e as error, r as redirect } from "./index3.js";
import crypto from "crypto";
const e = "sanity.previewUrlSecret", s = "2023-11-09", a = "sanity-preview-secret", r = "sanity-preview-pathname", i = "development" === process.env.NODE_ENV, d = `*[_type == "${e}" && secret == $secret && dateTime(_updatedAt) > dateTime(now()) - 3600][0]{
  _id,
  _updatedAt,
  secret,
  studioUrl,
}`, c = "sanity.preview-url-secret";
async function n(n2, a$1, c$1 = "Cloudflare-Workers" === globalThis.navigator?.userAgent) {
  const l = function(t) {
    if (!t) throw new TypeError("`client` is required");
    if (!t.config().token) throw new TypeError("`client` must have a `token` specified");
    return t.withConfig({ apiVersion: s, useCdn: false, perspective: "published", resultSourceMap: false, stega: false });
  }(n2);
  let u;
  try {
    u = function(e2) {
      const i2 = new URL(e2, "http://localhost"), s2 = i2.searchParams.get(a);
      if (!s2) throw new Error("Missing secret");
      let o;
      const n3 = i2.searchParams.get(r);
      if (n3) {
        const { pathname: e3, search: t, hash: r2 } = new URL(n3, "http://localhost");
        o = `${e3}${t}${r2}`;
      }
      return { secret: s2, redirectTo: o };
    }(a$1);
  } catch (e2) {
    return i && console.error("Failed to parse preview URL", e2, { previewUrl: a$1, client: l }), { isValid: false };
  }
  const { isValid: d$1, studioUrl: h } = await async function(e2, t, r2) {
    if (typeof EdgeRuntime < "u" && await new Promise((e3) => setTimeout(e3, 300)), !t || !t.trim()) return { isValid: false, studioUrl: null };
    const o = await e2.fetch(d, { secret: t }, { tag: c, ...r2 ? void 0 : { cache: "no-store" } });
    return o?._id && o?._updatedAt && o?.secret ? { isValid: t === o.secret, studioUrl: o.studioUrl } : { isValid: false, studioUrl: null };
  }(l, u.secret, c$1), p = d$1 ? u.redirectTo : void 0;
  let f;
  if (d$1) try {
    f = new URL(h).origin;
  } catch (e2) {
    i && console.error("Failed to parse studioUrl", e2, { previewUrl: a$1, studioUrl: h });
  }
  return { isValid: d$1, redirectTo: p, studioOrigin: f };
}
const handlePreview = ({ client: client2, preview }) => {
  const cookieName = preview?.cookie || "__sanity_preview";
  const enablePath = preview?.endpoints?.enable || "/preview/enable";
  const disablePath = preview?.endpoints?.disable || "/preview/disable";
  const secret = preview?.secret || crypto.randomBytes(16).toString("hex");
  if (!client2)
    throw new Error("No client configured for preview");
  return async ({ event, resolve }) => {
    const { cookies, url } = event;
    event.locals.preview = event.cookies.get(cookieName) === secret;
    const perspective = event.locals.preview ? "previewDrafts" : "published";
    const useCdn = event.locals.preview ? false : true;
    if (event.url.pathname === enablePath) {
      const { isValid, redirectTo = "/" } = await n(client2, url.toString());
      if (!isValid) {
        throw error(401, "Invalid secret");
      }
      const devMode = process.env.NODE_ENV === "development";
      cookies.set(cookieName, secret, {
        httpOnly: true,
        sameSite: devMode ? "lax" : "none",
        secure: !devMode,
        path: "/"
      });
      return redirect(307, redirectTo);
    }
    if (event.url.pathname === disablePath) {
      cookies.delete(cookieName, { path: "/" });
      return redirect(307, url.searchParams.get("redirect") || "/");
    }
    event.locals.client = client2.withConfig({
      perspective,
      useCdn
    });
    return await resolve(event);
  };
};
function sequence(...handlers) {
  const length = handlers.length;
  if (!length) return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i2, event2, parent_options) {
      const handle2 = handlers[i2];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i2 < length - 1 ? apply_handle(i2 + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
const handleLoadQuery = ({ client: _client, loadQuery: loadQuery$1 }) => async ({ event, resolve }) => {
  const client2 = _client || event.locals.client;
  if (!client2)
    throw new Error("No client instance provided to handleLoadQuery");
  const lq = loadQuery$1 || loadQuery;
  const { perspective, useCdn } = client2.config();
  event.locals.loadQuery = (query, params, options = {}) => {
    const stega = event.locals.preview ? options.stega : false;
    return lq(query, params, {
      ...options,
      perspective,
      useCdn,
      stega
    });
  };
  return await resolve(event);
};
const createRequestHandler = ({ preview, loadQuery: loadQuery2 } = {}) => {
  const client2 = preview?.client || unstable__serverClient.instance;
  if (!client2)
    throw new Error("No Sanity client configured for preview");
  return sequence(handlePreview({ client: client2, preview }), handleLoadQuery({ loadQuery: loadQuery2 }));
};
const SANITY_API_READ_TOKEN = "skHol2x5DbQtgU3HTl444qwC7Wbq7DcytwnU0uKL4hR5sclrFKoWlpN5yaPiGWpVpPBpIYnfjt7qAmoTTm9sKTWRrhoIF2W10rVqv8VcdYbFfyx8XgmAL0kwT0puvPLbyf44R0KnMz7jU8tlQ6iBn05oHVNVjTUP9CL1Wm1lGaicvif5uYEK";
const serverClient = client.withConfig({
  token: SANITY_API_READ_TOKEN,
  useCdn: true,
  stega: true
});
setServerClient(serverClient);
const handle = createRequestHandler();
export {
  handle
};
