import { b as ensure_array_like, p as pop, a as push } from "./index.js";
import { C as Card } from "./Card.js";
function CardGrid($$payload, $$props) {
  push();
  let {
    items,
    text = true,
    blog = false,
    baseURL = "."
  } = $$props;
  if (items.length) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(items);
    $$payload.out += `<div class="card-grid" data-sveltekit-preload-data="hover"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let i = each_array[$$index];
      Card($$payload, { item: i, baseURL, text, blog });
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  CardGrid as C
};
