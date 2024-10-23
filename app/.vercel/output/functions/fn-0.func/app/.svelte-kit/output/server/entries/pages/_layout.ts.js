import { inject } from "@vercel/analytics";
inject({ mode: "production" });
async function load({ url }) {
  let currentURL = url.pathname;
  return { currentURL };
}
export {
  load
};
