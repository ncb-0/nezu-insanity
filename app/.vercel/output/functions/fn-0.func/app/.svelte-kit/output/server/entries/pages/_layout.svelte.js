import { s as store_get, b as ensure_array_like, e as escape_html, c as attr, u as unsubscribe_stores, p as pop, a as push, k as rest_props, l as fallback, m as element, i as bind_props, o as slot, q as spread_attributes, t as sanitize_props, d as stringify, v as spread_props, h as head } from "../../chunks/index.js";
import { p as page, n as navigating } from "../../chunks/stores.js";
function Breadcrumb($$payload, $$props) {
  push();
  var $$store_subs;
  let { currentURL = "/" } = $$props;
  let crumbs = [];
  const tokens = currentURL.split("/").filter((t) => t !== "");
  let tokenPath = "";
  crumbs = tokens.map((t) => {
    tokenPath += "/" + t;
    t = t.charAt(0) + t.slice(1);
    return {
      label: store_get($$store_subs ??= {}, "$page", page).data.label || t,
      href: tokenPath
    };
  });
  crumbs.unshift({ label: "nezu.world", href: "/" });
  const each_array = ensure_array_like(crumbs);
  $$payload.out += `<!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let c = each_array[i];
    if (i == crumbs.length - 1) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="label">${escape_html(c.label)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<a${attr("href", c.href)}>${escape_html(c.label)}</a>/`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Modal($$payload, $$props) {
  push();
  let { shown = false, children } = $$props;
  $$payload.out += `<div class="help svelte-1t3lswl"${attr("shown", shown)}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  pop();
}
function OutClick($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "tag",
    "class",
    "excludeElements",
    "excludeQuerySelectorAll",
    "includeSelf",
    "halfClick"
  ]);
  push();
  let tag = fallback($$props["tag"], "div");
  let className = fallback($$props["class"], "");
  let excludeElements = fallback($$props["excludeElements"], () => [], true);
  let excludeQuerySelectorAll = fallback($$props["excludeQuerySelectorAll"], "");
  let includeSelf = fallback($$props["includeSelf"], false);
  let halfClick = fallback($$props["halfClick"], false);
  element(
    $$payload,
    tag,
    () => {
      $$payload.out += `${spread_attributes({
        class: className || void 0,
        style: !className ? "display: contents" : null,
        ...$$restProps
      })}`;
    },
    () => {
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "default", {});
      $$payload.out += `<!---->`;
    }
  );
  bind_props($$props, {
    tag,
    class: className,
    excludeElements,
    excludeQuerySelectorAll,
    includeSelf,
    halfClick
  });
  pop();
}
function Navbar($$payload, $$props) {
  push();
  var $$store_subs;
  let { currentURL, data, loading = false } = $$props;
  let shown = false;
  $$payload.out += `<nav class="real svelte-lhceam"><div class="svelte-lhceam">`;
  if (currentURL === "/") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 24 24" id="pira-top-left" class="svelte-lhceam"><path fill="rgb(var(--text-color))" d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"></path></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<a href="/" class="clean"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 24 24" id="pira-top-left" class="svelte-lhceam"><path fill="rgb(var(--text-color))" d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"></path></svg></a>`;
  }
  $$payload.out += `<!--]--></div> <div class="svelte-lhceam"><p class="svelte-lhceam">`;
  Breadcrumb($$payload, { currentURL });
  $$payload.out += `<!----></p> <p class="svelte-lhceam">`;
  if (store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.myTags && currentURL != "/" && !loading) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.myTags);
    $$payload.out += `<ul class="tags">`;
    if (store_get($$store_subs ??= {}, "$page", page).data.options.initial.data._type === "blogPost") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<date${attr("datetime", store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.date)}>${escape_html(store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.date)}</date> |`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tag = each_array[$$index];
      $$payload.out += `<li class="tag"><a${attr("href", `/tag/${stringify(tag._key)}`)}>${escape_html(tag._key)}</a></li>`;
    }
    $$payload.out += `<!--]--></ul>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (loading) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span>loading~</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (currentURL === "/") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span>&lt;/> with &lt;3 by <a href="/about">lisa m</a>, 2024.</span>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (store_get($$store_subs ??= {}, "$page", page).data.options.initial.data._type === "artwork") {
          $$payload.out += "<!--[-->";
          $$payload.out += `<date${attr("datetime", store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.date)}>${escape_html(store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.date)}</date>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<span>---</span>`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></p></div></nav> <nav class="fake svelte-lhceam"><div class="svelte-lhceam">`;
  if (currentURL === "/") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 24 24" id="pira-top-left" class="svelte-lhceam"><path fill="rgb(var(--text-color))" d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"></path></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<a href="/" class="clean"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 24 24" id="pira-top-left" class="svelte-lhceam"><path fill="rgb(var(--text-color))" d="M2.43 20H7l-2 4h5l2-4 2 4h5l-2-4h4.57l-6-12a6.57 6.57 0 0 1 4.81 6.08c.01.68-.11 1.35-.22 2.02 2.45-1.64 3.26-3.67 3.26-6.56C23.42 1.48 17.3 0 12 0S.58 1.48.58 9.54c0 2.89.8 4.92 3.26 6.56-.1-.67-.23-1.34-.22-2.02 0-2.11 1.45-5.1 4.8-6.08ZM8 13h1v5H8Zm7 0h1v5h-1z"></path></svg></a>`;
  }
  $$payload.out += `<!--]--></div> <div class="svelte-lhceam"><p class="svelte-lhceam">`;
  Breadcrumb($$payload, { currentURL });
  $$payload.out += `<!----></p> <p class="svelte-lhceam">`;
  if (store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.myTags && currentURL != "/" && !loading) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$page", page).data.options.initial.data.myTags);
    $$payload.out += `<ul class="tags"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let tag = each_array_1[$$index_1];
      $$payload.out += `<li class="tag"><a${attr("href", `/tag/${stringify(tag._key)}`)}>${escape_html(tag._key)}</a></li>`;
    }
    $$payload.out += `<!--]--></ul>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (loading) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span>loading~</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span>---</span>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></p></div></nav> `;
  OutClick($$payload, {
    excludeQuerySelectorAll: "a",
    children: ($$payload2) => {
      Modal($$payload2, spread_props([
        { shown },
        data,
        {
          children: ($$payload3) => {
            $$payload3.out += `<section><h2>nezu.world is the homepage of lisa m., an artist &amp; designer in toronto,
				canada.</h2></section> <section><h3>availability</h3> <p>i am available for freelance work~ i do flyers, album covers, etc.</p></section> <section><h3>contact</h3> <p>forward complaints: <a href="mailto:lisa@nezu.world">lisa@nezu.world</a></p></section>`;
          },
          $$slots: { default: true }
        }
      ]));
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Loader($$payload) {
  $$payload.out += `<div class="loader svelte-41cu8v"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 800 800" id="pira-loader" class="svelte-41cu8v"><defs class="svelte-41cu8v"><clipPath id="f" clipPathUnits="userSpaceOnUse" class="svelte-41cu8v"><use xlink:href="#halo-stroke" x="0" y="0" class="svelte-41cu8v"></use></clipPath><clipPath id="e" clipPathUnits="userSpaceOnUse" class="svelte-41cu8v"><path fill="rgb(var(--bg-color))" fill-opacity="1" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-miterlimit="100" stroke-opacity="1" stroke-width="5.5" d="M 1384,120 1416,56.000001 1448,120 Z" transform="matrix(0.68696063,0,0,0.68696063,529.14456,32.21969) matrix(1.4556875,0,0,1.4556875,-770.26912,-46.9018)" class="svelte-41cu8v"></path></clipPath></defs><g stroke-width=".96" display="inline" class="svelte-41cu8v"><g id="right-foot" class="svelte-41cu8v"><path fill="rgb(var(--bg-color))" fill-opacity="1" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-linejoin="bevel" stroke-miterlimit="100" stroke-opacity="1" stroke-width="3.57" d="m 1316.0683,-142.8988 a 19.957451,12.237789 0 0 1 4.3263,13.33662 19.957451,12.237789 0 0 1 -18.4383,7.55459 19.957451,12.237789 0 0 1 -18.4383,-7.55459 19.957451,12.237789 0 0 1 4.3262,-13.33662 z" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167) scale(1,-1)" class="svelte-41cu8v"></path></g><g id="left-foot" class="svelte-41cu8v"><path fill="rgb(var(--bg-color))" fill-opacity="1" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-linejoin="bevel" stroke-miterlimit="100" stroke-opacity="1" stroke-width="3.57" d="m 1294.1246,-142.8988 a 19.957451,12.237789 0 0 1 4.3263,13.33662 19.957451,12.237789 0 0 1 -18.4383,7.55459 19.957451,12.237789 0 0 1 -18.4383,-7.55459 19.957451,12.237789 0 0 1 4.3262,-13.33662 z" display="inline" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167) scale(1,-1)" class="svelte-41cu8v"></path></g><g id="main" class="svelte-41cu8v"><path id="halo-fill" fill="rgb(var(--bg-color))" fill-opacity="1" d="m 1289.3301,32.759815 c -9.5859,0.151823 -19.4725,1.215441 -28.5254,4.999386 -6.3239,2.649632 -12.1809,6.983869 -15.9883,13.067953 -4.3935,6.923017 -5.9524,15.428577 -6.0231,23.670535 -0.052,6.668204 0.6227,13.614425 3.7087,19.539807 2.6009,5.116233 7.118,8.818454 12.0351,11.162414 -1.194,-5.18185 -1.227,-10.660051 -0.2246,-15.881015 0.9681,-4.977594 3.5437,-9.642147 7.4206,-12.658812 4.9178,-3.898268 11.0676,-5.426124 17.0431,-6.234426 6.9814,-0.866016 14.0441,-0.886759 21.05,-0.363967 6.3672,0.581161 12.9144,1.724434 18.5,5.229353 4.0387,2.506252 7.1865,6.586113 8.628,11.333644 1.5035,4.874986 1.6888,10.13199 1.0966,15.195803 -0.1525,1.13663 -0.3553,2.26588 -0.6192,3.37942 4.947,-2.35608 9.4853,-6.09278 12.0822,-11.250803 3.0866,-5.993607 3.7328,-13.003849 3.6588,-19.730335 -0.1051,-8.186166 -1.6887,-16.627807 -6.0812,-23.483335 -3.9563,-6.281748 -10.0958,-10.669257 -16.6762,-13.281793 -7.8257,-3.133528 -16.2172,-4.264023 -24.5285,-4.610541 -2.0971,-0.08031 -4.3879,-0.108927 -6.5566,-0.0833 z" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167)" class="svelte-41cu8v"></path><g id="body" class="svelte-41cu8v"><g clip-path="url(#e)" fill="rgb(var(--bg-color))" fill-opacity="1" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-miterlimit="100" stroke-opacity="1" stroke-width="4.9" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167) matrix(1.4556875,0,0,1.4556875,-770.26912,-46.9018)" class="svelte-41cu8v"><path d="M 1384,120 1416,56.000001 1448,120 Z" class="svelte-41cu8v"></path></g></g><g id="mouth" class="svelte-41cu8v"><path fill="none" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-linejoin="bevel" stroke-miterlimit="100" stroke-opacity="1" stroke-width="1.53" d="m 1293.7677,94.476918 c -0.3656,0.25865 -0.6566,0.621368 -0.8299,1.034276 -0.1733,0.412907 -0.2283,0.874693 -0.1569,1.316762 0.068,0.421912 0.2517,0.825635 0.5308,1.149301 0.2792,0.323667 0.6536,0.565517 1.0656,0.679284 0.3734,0.103124 0.7754,0.100491 1.1475,-0.0075 0.372,-0.108007 0.713,-0.321057 0.9731,-0.608114 0.2602,-0.287056 0.4388,-0.647244 0.5098,-1.028088 0.071,-0.380845 0.034,-0.781185 -0.1051,-1.142698 -0.1587,0.367049 -0.2082,0.78051 -0.1407,1.17465 0.068,0.39414 0.252,0.767517 0.5238,1.060771 0.2719,0.293255 0.6303,0.505313 1.0182,0.602462 0.3879,0.09715 0.8039,0.07903 1.1819,-0.05147 0.6069,-0.209514 1.103,-0.716526 1.2992,-1.327797 0.1963,-0.611271 0.088,-1.312316 -0.2834,-1.835945" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167) matrix(1.1489832,0,0,1.1758609,-199.44937,3.5789017)" class="svelte-41cu8v"></path></g><g clip-path="url(#f)" display="inline" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167) matrix(0.14267846,0,0,0.14258122,1217.933,13.9347)" class="svelte-41cu8v"><path id="halo-stroke" fill="none" fill-opacity="0" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-miterlimit="100" stroke-opacity="1" stroke-width="50" d="m 278.9449,665.67447 c -10.26679,-28.49468 -14.88683,-53.35175 -14.88683,-84.27152 0,-127.92301 75.97397,-175.21208 247.94218,-175.21208 171.9678,0 247.94212,47.28907 247.94212,175.21208 0,30.91977 -4.62018,55.77684 -14.88732,84.27152 C 848.23601,627.4795 891.86978,557.15214 891.86978,430.44168 891.86978,218.24712 766.61542,117 512.00025,117 257.38467,117 132.13038,218.24712 132.13038,430.44168 c 0,126.71046 43.6337,197.03782 146.81452,235.23279 z" display="inline" style="line-height:.8;-inkscape-font-specification:&quot;Mega 2, &quot;" class="svelte-41cu8v"></path></g><g id="eyes" class="svelte-41cu8v"><path fill="none" fill-opacity="1" stroke="rgb(var(--text-color))" stroke-dasharray="none" stroke-miterlimit="100" stroke-opacity="1" stroke-width="3.57" d="M1273.88 86.53V114.84M1308.08 86.53V114.84" display="inline" transform="matrix(7.0087663,0,0,7.0135466,-8648.2078,-214.73167)" class="svelte-41cu8v"></path></g></g></g></svg></div>`;
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { data, children } = $$props;
  data.currentURL;
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="theme-color" media="(prefers-color-scheme: light)" content="rgb(255, 255, 255)"> <meta name="theme-color" media="(prefers-color-scheme: dark)" content="rgb(46, 23, 30)">`;
  });
  $$payload.out += `<!---->`;
  {
    if (store_get($$store_subs ??= {}, "$navigating", navigating)) {
      $$payload.out += "<!--[-->";
      Navbar($$payload, { currentURL: "/", data: "", loading: "true" });
      $$payload.out += `<!----> <div>`;
      Loader($$payload);
      $$payload.out += `<!----></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      Navbar($$payload, spread_props([data]));
      $$payload.out += `<!----> <div>`;
      children?.($$payload);
      $$payload.out += `<!----></div> <div class="flowers-top"></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
