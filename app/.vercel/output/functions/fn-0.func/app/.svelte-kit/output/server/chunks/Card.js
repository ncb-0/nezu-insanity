import { c as attr, e as escape_html, p as pop, a as push } from "./index.js";
import { u as urlFor } from "./image.js";
/* empty css                                   */
function Card($$payload, $$props) {
  push();
  let {
    item,
    baseURL = "",
    text = true,
    nsfw = false
  } = $$props;
  $$payload.out += `<div class="card svelte-9o15mw"><div class="dogear svelte-9o15mw"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 18 18"><path fill="rgb(var(--bg-color))" d="M0 0h18v18H0z"></path><path fill="rgb(var(--bg-color))" d="m.5 3.2 14.3 14.3H.5z"></path><path fill="rgb(var(--text-color))" d="M1 4.4 13.6 17H1V4.4M0 2v16h16L0 2Z"></path></svg></div> <a${attr("href", `${baseURL ? `${baseURL}/` : "/"}${item.slug.current}`)}${attr("title", item.title)} class="svelte-9o15mw">`;
  if (item.mainImage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<img${attr("src", urlFor(item.mainImage).format("jpg").width(512).height(512).bg("ffff").blur(nsfw ? 128 : 1).url())} width="512px" height="512px" style="aspect-ratio: 1 / 1" loading="lazy" class="svelte-9o15mw"> `;
    if (nsfw) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="nsfw svelte-9o15mw">nsfw</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (item.mainImage) {
    $$payload.out += "<!--[-->";
    if (text == true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="pad svelte-9o15mw">`;
      if (item.shortTitle) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<p class="svelte-9o15mw">${escape_html(item.shortTitle)}</p>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (item.title) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<p class="svelte-9o15mw">${escape_html(item.title)}</p>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="pad svelte-9o15mw"><h3 class="svelte-9o15mw">${escape_html(item.title)}</h3> <time${attr("datetime", item.date)} class="svelte-9o15mw">${escape_html(item.date)}</time> <p class="svelte-9o15mw">${escape_html(item.excerpt)}</p></div>`;
  }
  $$payload.out += `<!--]--></a></div>`;
  pop();
}
export {
  Card as C
};
