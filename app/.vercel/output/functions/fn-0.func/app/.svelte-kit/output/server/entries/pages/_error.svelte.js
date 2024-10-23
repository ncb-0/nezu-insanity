import { e as escape_html, s as store_get, u as unsubscribe_stores, p as pop, a as push } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
function _error($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<h1>${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <h2>${escape_html(store_get($$store_subs ??= {}, "$page", page).error.message)}</h2>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _error as default
};
