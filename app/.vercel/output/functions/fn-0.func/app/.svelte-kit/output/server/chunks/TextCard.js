import { c as attr, e as escape_html, p as pop, a as push } from "./index.js";
function TextCard($$payload, $$props) {
  push();
  let { item, baseURL = "", blog = true } = $$props;
  Date.parse(item._createdAt);
  console.log(item._createdAt);
  $$payload.out += `<div class="card svelte-s7higq"><div class="dogear svelte-s7higq"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 18 18"><path fill="rgb(var(--bg-color))" d="M0 0h18v18H0z"></path><path fill="rgb(var(--bg-color))" d="m.5 3.2 14.3 14.3H.5z"></path><path fill="rgb(var(--text-color))" d="M1 4.4 13.6 17H1V4.4M0 2v16h16L0 2Z"></path></svg></div> <a${attr("href", `${baseURL ? `${baseURL}/` : "/"}${item.slug.current}`)}${attr("title", item.title)} class="svelte-s7higq"><div class="pad svelte-s7higq"><time${attr("datetime", item.date)} class="svelte-s7higq">${escape_html(item.date)}</time> <h2>${escape_html(item.title)}</h2> `;
  if (item.excerpt) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="serif-2 svelte-s7higq">${escape_html(item.excerpt)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></a></div>`;
  pop();
}
export {
  TextCard as T
};
