import { w as writable, d as derived } from "./index2.js";
import { getPublishedId, studioPath, studioPathToJsonPath, resolveEditInfo, jsonPathToStudioPath } from "@sanity/client/csm";
var e, t, r$1 = {};
var n$2, i$1, s$1, o$1, a$2, c$1, l$1, u$1, f, h = { exports: {} };
function g() {
  return n$2 || (n$2 = 1, function(e5, t2) {
    const { hasOwnProperty: r2 } = Object.prototype, n2 = g2();
    n2.configure = g2, n2.stringify = n2, n2.default = n2, t2.stringify = n2, t2.configure = g2, e5.exports = n2;
    const i2 = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]|[\ud800-\udbff](?![\udc00-\udfff])|(?:[^\ud800-\udbff]|^)[\udc00-\udfff]/;
    function s2(e6) {
      return e6.length < 5e3 && !i2.test(e6) ? `"${e6}"` : JSON.stringify(e6);
    }
    function o2(e6) {
      if (e6.length > 200) return e6.sort();
      for (let t3 = 1; t3 < e6.length; t3++) {
        const r3 = e6[t3];
        let n3 = t3;
        for (; 0 !== n3 && e6[n3 - 1] > r3; ) e6[n3] = e6[n3 - 1], n3--;
        e6[n3] = r3;
      }
      return e6;
    }
    const a2 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())), Symbol.toStringTag).get;
    function c2(e6) {
      return void 0 !== a2.call(e6) && 0 !== e6.length;
    }
    function l2(e6, t3, r3) {
      e6.length < r3 && (r3 = e6.length);
      const n3 = "," === t3 ? "" : " ";
      let i3 = `"0":${n3}${e6[0]}`;
      for (let s3 = 1; s3 < r3; s3++) i3 += `${t3}"${s3}":${n3}${e6[s3]}`;
      return i3;
    }
    function u2(e6, t3) {
      let n3;
      if (r2.call(e6, t3) && (n3 = e6[t3], "boolean" != typeof n3)) throw new TypeError(`The "${t3}" argument must be of type boolean`);
      return void 0 === n3 || n3;
    }
    function f2(e6, t3) {
      let n3;
      if (r2.call(e6, t3)) {
        if (n3 = e6[t3], "number" != typeof n3) throw new TypeError(`The "${t3}" argument must be of type number`);
        if (!Number.isInteger(n3)) throw new TypeError(`The "${t3}" argument must be an integer`);
        if (n3 < 1) throw new RangeError(`The "${t3}" argument must be >= 1`);
      }
      return void 0 === n3 ? 1 / 0 : n3;
    }
    function h2(e6) {
      return 1 === e6 ? "1 item" : `${e6} items`;
    }
    function g2(e6) {
      const t3 = function(e7) {
        if (r2.call(e7, "strict")) {
          const t4 = e7.strict;
          if ("boolean" != typeof t4) throw new TypeError('The "strict" argument must be of type boolean');
          if (t4) return (e8) => {
            let t5 = "Object can not safely be stringified. Received type " + typeof e8;
            throw "function" != typeof e8 && (t5 += ` (${e8.toString()})`), new Error(t5);
          };
        }
      }(e6 = { ...e6 });
      t3 && (void 0 === e6.bigint && (e6.bigint = false), "circularValue" in e6 || (e6.circularValue = Error));
      const n3 = function(e7) {
        if (r2.call(e7, "circularValue")) {
          const t4 = e7.circularValue;
          if ("string" == typeof t4) return `"${t4}"`;
          if (null == t4) return t4;
          if (t4 === Error || t4 === TypeError) return { toString() {
            throw new TypeError("Converting circular structure to JSON");
          } };
          throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
        }
        return '"[Circular]"';
      }(e6), i3 = u2(e6, "bigint"), a3 = u2(e6, "deterministic"), g3 = f2(e6, "maximumDepth"), d2 = f2(e6, "maximumBreadth");
      function y2(e7, r3, l3, u3, f3, m3) {
        let p3 = r3[e7];
        switch ("object" == typeof p3 && null !== p3 && "function" == typeof p3.toJSON && (p3 = p3.toJSON(e7)), p3 = u3.call(r3, e7, p3), typeof p3) {
          case "string":
            return s2(p3);
          case "object": {
            if (null === p3) return "null";
            if (-1 !== l3.indexOf(p3)) return n3;
            let e8 = "", t4 = ",";
            const r4 = m3;
            if (Array.isArray(p3)) {
              if (0 === p3.length) return "[]";
              if (g3 < l3.length + 1) return '"[Array]"';
              l3.push(p3), "" !== f3 && (e8 += `
${m3 += f3}`, t4 = `,
${m3}`);
              const n4 = Math.min(p3.length, d2);
              let i5 = 0;
              for (; i5 < n4 - 1; i5++) {
                const r5 = y2(String(i5), p3, l3, u3, f3, m3);
                e8 += void 0 !== r5 ? r5 : "null", e8 += t4;
              }
              const s3 = y2(String(i5), p3, l3, u3, f3, m3);
              if (e8 += void 0 !== s3 ? s3 : "null", p3.length - 1 > d2) {
                e8 += `${t4}"... ${h2(p3.length - d2 - 1)} not stringified"`;
              }
              return "" !== f3 && (e8 += `
${r4}`), l3.pop(), `[${e8}]`;
            }
            let i4 = Object.keys(p3);
            const v3 = i4.length;
            if (0 === v3) return "{}";
            if (g3 < l3.length + 1) return '"[Object]"';
            let b2 = "", w2 = "";
            "" !== f3 && (t4 = `,
${m3 += f3}`, b2 = " ");
            const k2 = Math.min(v3, d2);
            a3 && !c2(p3) && (i4 = o2(i4)), l3.push(p3);
            for (let r5 = 0; r5 < k2; r5++) {
              const n4 = i4[r5], o3 = y2(n4, p3, l3, u3, f3, m3);
              void 0 !== o3 && (e8 += `${w2}${s2(n4)}:${b2}${o3}`, w2 = t4);
            }
            if (v3 > d2) {
              e8 += `${w2}"...":${b2}"${h2(v3 - d2)} not stringified"`, w2 = t4;
            }
            return "" !== f3 && w2.length > 1 && (e8 = `
${m3}${e8}
${r4}`), l3.pop(), `{${e8}}`;
          }
          case "number":
            return isFinite(p3) ? String(p3) : t3 ? t3(p3) : "null";
          case "boolean":
            return true === p3 ? "true" : "false";
          case "undefined":
            return;
          case "bigint":
            if (i3) return String(p3);
          default:
            return t3 ? t3(p3) : void 0;
        }
      }
      function m2(e7, r3, o3, a4, c3, l3) {
        switch ("object" == typeof r3 && null !== r3 && "function" == typeof r3.toJSON && (r3 = r3.toJSON(e7)), typeof r3) {
          case "string":
            return s2(r3);
          case "object": {
            if (null === r3) return "null";
            if (-1 !== o3.indexOf(r3)) return n3;
            const e8 = l3;
            let t4 = "", i4 = ",";
            if (Array.isArray(r3)) {
              if (0 === r3.length) return "[]";
              if (g3 < o3.length + 1) return '"[Array]"';
              o3.push(r3), "" !== c3 && (t4 += `
${l3 += c3}`, i4 = `,
${l3}`);
              const n4 = Math.min(r3.length, d2);
              let s3 = 0;
              for (; s3 < n4 - 1; s3++) {
                const e9 = m2(String(s3), r3[s3], o3, a4, c3, l3);
                t4 += void 0 !== e9 ? e9 : "null", t4 += i4;
              }
              const u4 = m2(String(s3), r3[s3], o3, a4, c3, l3);
              if (t4 += void 0 !== u4 ? u4 : "null", r3.length - 1 > d2) {
                t4 += `${i4}"... ${h2(r3.length - d2 - 1)} not stringified"`;
              }
              return "" !== c3 && (t4 += `
${e8}`), o3.pop(), `[${t4}]`;
            }
            o3.push(r3);
            let u3 = "";
            "" !== c3 && (i4 = `,
${l3 += c3}`, u3 = " ");
            let f3 = "";
            for (const e9 of a4) {
              const n4 = m2(e9, r3[e9], o3, a4, c3, l3);
              void 0 !== n4 && (t4 += `${f3}${s2(e9)}:${u3}${n4}`, f3 = i4);
            }
            return "" !== c3 && f3.length > 1 && (t4 = `
${l3}${t4}
${e8}`), o3.pop(), `{${t4}}`;
          }
          case "number":
            return isFinite(r3) ? String(r3) : t3 ? t3(r3) : "null";
          case "boolean":
            return true === r3 ? "true" : "false";
          case "undefined":
            return;
          case "bigint":
            if (i3) return String(r3);
          default:
            return t3 ? t3(r3) : void 0;
        }
      }
      function p2(e7, r3, u3, f3, y3) {
        switch (typeof r3) {
          case "string":
            return s2(r3);
          case "object": {
            if (null === r3) return "null";
            if ("function" == typeof r3.toJSON) {
              if ("object" != typeof (r3 = r3.toJSON(e7))) return p2(e7, r3, u3, f3, y3);
              if (null === r3) return "null";
            }
            if (-1 !== u3.indexOf(r3)) return n3;
            const t4 = y3;
            if (Array.isArray(r3)) {
              if (0 === r3.length) return "[]";
              if (g3 < u3.length + 1) return '"[Array]"';
              u3.push(r3);
              let e8 = `
${y3 += f3}`;
              const n4 = `,
${y3}`, i5 = Math.min(r3.length, d2);
              let s3 = 0;
              for (; s3 < i5 - 1; s3++) {
                const t5 = p2(String(s3), r3[s3], u3, f3, y3);
                e8 += void 0 !== t5 ? t5 : "null", e8 += n4;
              }
              const o3 = p2(String(s3), r3[s3], u3, f3, y3);
              if (e8 += void 0 !== o3 ? o3 : "null", r3.length - 1 > d2) {
                e8 += `${n4}"... ${h2(r3.length - d2 - 1)} not stringified"`;
              }
              return e8 += `
${t4}`, u3.pop(), `[${e8}]`;
            }
            let i4 = Object.keys(r3);
            const m3 = i4.length;
            if (0 === m3) return "{}";
            if (g3 < u3.length + 1) return '"[Object]"';
            const v3 = `,
${y3 += f3}`;
            let b2 = "", w2 = "", k2 = Math.min(m3, d2);
            c2(r3) && (b2 += l2(r3, v3, d2), i4 = i4.slice(r3.length), k2 -= r3.length, w2 = v3), a3 && (i4 = o2(i4)), u3.push(r3);
            for (let e8 = 0; e8 < k2; e8++) {
              const t5 = i4[e8], n4 = p2(t5, r3[t5], u3, f3, y3);
              void 0 !== n4 && (b2 += `${w2}${s2(t5)}: ${n4}`, w2 = v3);
            }
            if (m3 > d2) {
              b2 += `${w2}"...": "${h2(m3 - d2)} not stringified"`, w2 = v3;
            }
            return "" !== w2 && (b2 = `
${y3}${b2}
${t4}`), u3.pop(), `{${b2}}`;
          }
          case "number":
            return isFinite(r3) ? String(r3) : t3 ? t3(r3) : "null";
          case "boolean":
            return true === r3 ? "true" : "false";
          case "undefined":
            return;
          case "bigint":
            if (i3) return String(r3);
          default:
            return t3 ? t3(r3) : void 0;
        }
      }
      function v2(e7, r3, u3) {
        switch (typeof r3) {
          case "string":
            return s2(r3);
          case "object": {
            if (null === r3) return "null";
            if ("function" == typeof r3.toJSON) {
              if ("object" != typeof (r3 = r3.toJSON(e7))) return v2(e7, r3, u3);
              if (null === r3) return "null";
            }
            if (-1 !== u3.indexOf(r3)) return n3;
            let t4 = "";
            if (Array.isArray(r3)) {
              if (0 === r3.length) return "[]";
              if (g3 < u3.length + 1) return '"[Array]"';
              u3.push(r3);
              const e8 = Math.min(r3.length, d2);
              let n4 = 0;
              for (; n4 < e8 - 1; n4++) {
                const e9 = v2(String(n4), r3[n4], u3);
                t4 += void 0 !== e9 ? e9 : "null", t4 += ",";
              }
              const i5 = v2(String(n4), r3[n4], u3);
              if (t4 += void 0 !== i5 ? i5 : "null", r3.length - 1 > d2) {
                t4 += `,"... ${h2(r3.length - d2 - 1)} not stringified"`;
              }
              return u3.pop(), `[${t4}]`;
            }
            let i4 = Object.keys(r3);
            const f3 = i4.length;
            if (0 === f3) return "{}";
            if (g3 < u3.length + 1) return '"[Object]"';
            let y3 = "", m3 = Math.min(f3, d2);
            c2(r3) && (t4 += l2(r3, ",", d2), i4 = i4.slice(r3.length), m3 -= r3.length, y3 = ","), a3 && (i4 = o2(i4)), u3.push(r3);
            for (let e8 = 0; e8 < m3; e8++) {
              const n4 = i4[e8], o3 = v2(n4, r3[n4], u3);
              void 0 !== o3 && (t4 += `${y3}${s2(n4)}:${o3}`, y3 = ",");
            }
            if (f3 > d2) {
              t4 += `${y3}"...":"${h2(f3 - d2)} not stringified"`;
            }
            return u3.pop(), `{${t4}}`;
          }
          case "number":
            return isFinite(r3) ? String(r3) : t3 ? t3(r3) : "null";
          case "boolean":
            return true === r3 ? "true" : "false";
          case "undefined":
            return;
          case "bigint":
            if (i3) return String(r3);
          default:
            return t3 ? t3(r3) : void 0;
        }
      }
      return function(e7, t4, r3) {
        if (arguments.length > 1) {
          let n4 = "";
          if ("number" == typeof r3 ? n4 = " ".repeat(Math.min(r3, 10)) : "string" == typeof r3 && (n4 = r3.slice(0, 10)), null != t4) {
            if ("function" == typeof t4) return y2("", { "": e7 }, [], t4, n4, "");
            if (Array.isArray(t4)) return m2("", e7, [], function(e8) {
              const t5 = /* @__PURE__ */ new Set();
              for (const r4 of e8) ("string" == typeof r4 || "number" == typeof r4) && t5.add(String(r4));
              return t5;
            }(t4), n4, "");
          }
          if (0 !== n4.length) return p2("", e7, [], n4, "");
        }
        return v2("", e7, []);
      };
    }
  }(h, h.exports)), h.exports;
}
function d() {
  if (s$1) return i$1;
  function e5(e6) {
    return e6 * Math.random() | 0;
  }
  return s$1 = 1, i$1 = { findNotMatching: function(e6, t2) {
    const r2 = [];
    let n2 = 0;
    for (let i2 = 0; i2 < e6.length; i2++) for (let s2 = n2; s2 < t2.length; s2++) e6[i2] !== t2[s2] && (r2.push(t2[s2]), n2 = s2 + 1);
    return r2;
  }, findMatchingIndexes: function(e6, t2) {
    const r2 = [];
    let n2 = 0;
    for (let i2 = 0; i2 < e6.length; i2++) for (let s2 = n2; s2 < t2.length; s2++) e6[i2] === t2[s2] && (r2.push(s2), n2 = s2 + 1);
    return r2;
  }, bsearchIndex: function(e6, t2) {
    let r2 = 0, n2 = e6.length - 1;
    for (; r2 <= n2; ) {
      const i2 = (r2 + n2) / 2 | 0;
      if (e6[i2] === t2) return i2;
      e6[i2] < t2 ? r2 = i2 + 1 : n2 = i2 - 1;
    }
    return -1;
  }, wildcardMatch: function(e6, t2) {
    if ("*" === e6 || e6.length === t2.length && e6 === t2) return true;
    let r2 = 0, n2 = 0;
    for (; r2 < e6.length && n2 < t2.length; ) if (e6[r2] !== t2[n2]) {
      if ("*" !== e6[r2]) return false;
      if (e6[r2 + 1] === t2[n2]) {
        r2++;
        continue;
      }
      n2++;
    } else r2++, n2++;
    return r2 >= e6.length - 1;
  }, randomSubset: function(t2, r2) {
    if (t2.length < 1 || r2 < 1) return [];
    const n2 = Math.min(t2.length, r2), i2 = (o2 = 1, a2 = n2, (o2 = Math.floor(o2)) + e5(1 + (a2 = Math.floor(a2)) - o2)), s2 = /* @__PURE__ */ new Set();
    var o2, a2;
    for (let r3 = 0; r3 < i2; r3++) s2.add(e5(t2.length));
    const c2 = [];
    for (const e6 of s2) c2.push(t2[e6]);
    return c2;
  }, abstractLogging: function() {
    const e6 = () => {
    };
    return { fatal: e6, error: e6, warn: e6, info: e6, debug: e6, trace: e6 };
  }, isServerSide: typeof window > "u" };
}
function y$1() {
  if (a$2) return o$1;
  a$2 = 1;
  return o$1 = class {
    constructor(e5) {
      this.options = e5;
    }
    async get(e5) {
      throw new Error("storage get method not implemented");
    }
    async set(e5, t2, r2, n2) {
      throw new Error("storage set method not implemented");
    }
    async remove(e5) {
      throw new Error("storage remove method not implemented");
    }
    async invalidate(e5) {
      throw new Error("storage invalidate method not implemented");
    }
    async clear(e5) {
      throw new Error("storage clear method not implemented");
    }
    async refresh() {
      throw new Error("storage refresh method not implemented");
    }
  };
}
var m, p$1, v, b = {};
function w() {
  if (v) return p$1;
  v = 1;
  var e5 = (m || (m = 1, b.ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer < "u", b.SYMBOL_SUPPORT = typeof Symbol < "u"), b), t2 = e5.ARRAY_BUFFER_SUPPORT, r2 = e5.SYMBOL_SUPPORT;
  return p$1 = function(e6, n2) {
    var i2, s2, o2, a2, c2;
    if (!e6) throw new Error("obliterator/forEach: invalid iterable.");
    if ("function" != typeof n2) throw new Error("obliterator/forEach: expecting a callback.");
    if (Array.isArray(e6) || t2 && ArrayBuffer.isView(e6) || "string" == typeof e6 || "[object Arguments]" === e6.toString()) for (o2 = 0, a2 = e6.length; o2 < a2; o2++) n2(e6[o2], o2);
    else if ("function" != typeof e6.forEach) if (r2 && Symbol.iterator in e6 && "function" != typeof e6.next && (e6 = e6[Symbol.iterator]()), "function" != typeof e6.next) for (s2 in e6) e6.hasOwnProperty(s2) && n2(e6[s2], s2);
    else for (i2 = e6, o2 = 0; true !== (c2 = i2.next()).done; ) n2(c2.value, o2), o2++;
    else e6.forEach(n2);
  };
}
var k, S = {};
function E() {
  return k || (k = 1, function(e5) {
    var t2 = Math.pow(2, 8) - 1, r2 = Math.pow(2, 16) - 1, n2 = Math.pow(2, 32) - 1, i2 = Math.pow(2, 7) - 1, s2 = Math.pow(2, 15) - 1, o2 = Math.pow(2, 31) - 1;
    e5.getPointerArray = function(e6) {
      var i3 = e6 - 1;
      if (i3 <= t2) return Uint8Array;
      if (i3 <= r2) return Uint16Array;
      if (i3 <= n2) return Uint32Array;
      throw new Error("mnemonist: Pointer Array of size > 4294967295 is not supported.");
    }, e5.getSignedPointerArray = function(e6) {
      var t3 = e6 - 1;
      return t3 <= i2 ? Int8Array : t3 <= s2 ? Int16Array : t3 <= o2 ? Int32Array : Float64Array;
    }, e5.getNumberType = function(e6) {
      return e6 === (0 | e6) ? -1 === Math.sign(e6) ? e6 <= 127 && e6 >= -128 ? Int8Array : e6 <= 32767 && e6 >= -32768 ? Int16Array : Int32Array : e6 <= 255 ? Uint8Array : e6 <= 65535 ? Uint16Array : Uint32Array : Float64Array;
    };
    var a2 = { Uint8Array: 1, Int8Array: 2, Uint16Array: 3, Int16Array: 4, Uint32Array: 5, Int32Array: 6, Float32Array: 7, Float64Array: 8 };
    e5.getMinimalRepresentation = function(t3, r3) {
      var n3, i3, s3, o3, c2, l2 = null, u2 = 0;
      for (o3 = 0, c2 = t3.length; o3 < c2; o3++) s3 = r3 ? r3(t3[o3]) : t3[o3], i3 = e5.getNumberType(s3), (n3 = a2[i3.name]) > u2 && (u2 = n3, l2 = i3);
      return l2;
    }, e5.isTypedArray = function(e6) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView(e6);
    }, e5.concat = function() {
      var e6, t3, r3, n3 = 0;
      for (e6 = 0, r3 = arguments.length; e6 < r3; e6++) n3 += arguments[e6].length;
      var i3 = new arguments[0].constructor(n3);
      for (e6 = 0, t3 = 0; e6 < r3; e6++) i3.set(arguments[e6], t3), t3 += arguments[e6].length;
      return i3;
    }, e5.indices = function(t3) {
      for (var r3 = new (e5.getPointerArray(t3))(t3), n3 = 0; n3 < t3; n3++) r3[n3] = n3;
      return r3;
    };
  }(S)), S;
}
var R, $, A, T, O, K, M, _, z, x, L = {};
function N() {
  if (A) return $;
  A = 1;
  var e5 = function() {
    if (f) return u$1;
    function e6(e7) {
      if ("function" != typeof e7) throw new Error("obliterator/iterator: expecting a function!");
      this.next = e7;
    }
    return f = 1, typeof Symbol < "u" && (e6.prototype[Symbol.iterator] = function() {
      return this;
    }), e6.of = function() {
      var t3 = arguments, r3 = t3.length, n3 = 0;
      return new e6(function() {
        return n3 >= r3 ? { done: true } : { done: false, value: t3[n3++] };
      });
    }, e6.empty = function() {
      return new e6(function() {
        return { done: true };
      });
    }, e6.fromSequence = function(t3) {
      var r3 = 0, n3 = t3.length;
      return new e6(function() {
        return r3 >= n3 ? { done: true } : { done: false, value: t3[r3++] };
      });
    }, e6.is = function(t3) {
      return t3 instanceof e6 || "object" == typeof t3 && null !== t3 && "function" == typeof t3.next;
    }, u$1 = e6;
  }(), t2 = w(), r2 = E(), n2 = function() {
    if (R) return L;
    R = 1;
    var e6 = w(), t3 = E();
    function r3(e7) {
      return "number" == typeof e7.length ? e7.length : "number" == typeof e7.size ? e7.size : void 0;
    }
    return L.isArrayLike = function(e7) {
      return Array.isArray(e7) || t3.isTypedArray(e7);
    }, L.guessLength = r3, L.toArray = function(t4) {
      var n3 = r3(t4), i3 = "number" == typeof n3 ? new Array(n3) : [], s2 = 0;
      return e6(t4, function(e7) {
        i3[s2++] = e7;
      }), i3;
    }, L.toArrayWithIndices = function(n3) {
      var i3 = r3(n3), s2 = "number" == typeof i3 ? t3.getPointerArray(i3) : Array, o2 = "number" == typeof i3 ? new Array(i3) : [], a2 = "number" == typeof i3 ? new s2(i3) : [], c2 = 0;
      return e6(n3, function(e7) {
        o2[c2] = e7, a2[c2] = c2++;
      }), [o2, a2];
    }, L;
  }();
  function i2(e6, t3, n3) {
    if (arguments.length < 2 && (n3 = e6, e6 = null, t3 = null), this.capacity = n3, "number" != typeof this.capacity || this.capacity <= 0) throw new Error("mnemonist/lru-cache: capacity should be positive number.");
    if (!isFinite(this.capacity) || Math.floor(this.capacity) !== this.capacity) throw new Error("mnemonist/lru-cache: capacity should be a finite positive integer.");
    var i3 = r2.getPointerArray(n3);
    this.forward = new i3(n3), this.backward = new i3(n3), this.K = "function" == typeof e6 ? new e6(n3) : new Array(n3), this.V = "function" == typeof t3 ? new t3(n3) : new Array(n3), this.size = 0, this.head = 0, this.tail = 0, this.items = {};
  }
  return i2.prototype.clear = function() {
    this.size = 0, this.head = 0, this.tail = 0, this.items = {};
  }, i2.prototype.splayOnTop = function(e6) {
    var t3 = this.head;
    if (this.head === e6) return this;
    var r3 = this.backward[e6], n3 = this.forward[e6];
    return this.tail === e6 ? this.tail = r3 : this.backward[n3] = r3, this.forward[r3] = n3, this.backward[t3] = e6, this.head = e6, this.forward[e6] = t3, this;
  }, i2.prototype.set = function(e6, t3) {
    var r3 = this.items[e6];
    if (typeof r3 < "u") return this.splayOnTop(r3), void (this.V[r3] = t3);
    this.size < this.capacity ? r3 = this.size++ : (r3 = this.tail, this.tail = this.backward[r3], delete this.items[this.K[r3]]), this.items[e6] = r3, this.K[r3] = e6, this.V[r3] = t3, this.forward[r3] = this.head, this.backward[this.head] = r3, this.head = r3;
  }, i2.prototype.setpop = function(e6, t3) {
    var r3 = null, n3 = null, i3 = this.items[e6];
    return typeof i3 < "u" ? (this.splayOnTop(i3), r3 = this.V[i3], this.V[i3] = t3, { evicted: false, key: e6, value: r3 }) : (this.size < this.capacity ? i3 = this.size++ : (i3 = this.tail, this.tail = this.backward[i3], r3 = this.V[i3], n3 = this.K[i3], delete this.items[n3]), this.items[e6] = i3, this.K[i3] = e6, this.V[i3] = t3, this.forward[i3] = this.head, this.backward[this.head] = i3, this.head = i3, n3 ? { evicted: true, key: n3, value: r3 } : null);
  }, i2.prototype.has = function(e6) {
    return e6 in this.items;
  }, i2.prototype.get = function(e6) {
    var t3 = this.items[e6];
    if (!(typeof t3 > "u")) return this.splayOnTop(t3), this.V[t3];
  }, i2.prototype.peek = function(e6) {
    var t3 = this.items[e6];
    if (!(typeof t3 > "u")) return this.V[t3];
  }, i2.prototype.forEach = function(e6, t3) {
    t3 = arguments.length > 1 ? t3 : this;
    for (var r3 = 0, n3 = this.size, i3 = this.head, s2 = this.K, o2 = this.V, a2 = this.forward; r3 < n3; ) e6.call(t3, o2[i3], s2[i3], this), i3 = a2[i3], r3++;
  }, i2.prototype.keys = function() {
    var t3 = 0, r3 = this.size, n3 = this.head, i3 = this.K, s2 = this.forward;
    return new e5(function() {
      if (t3 >= r3) return { done: true };
      var e6 = i3[n3];
      return ++t3 < r3 && (n3 = s2[n3]), { done: false, value: e6 };
    });
  }, i2.prototype.values = function() {
    var t3 = 0, r3 = this.size, n3 = this.head, i3 = this.V, s2 = this.forward;
    return new e5(function() {
      if (t3 >= r3) return { done: true };
      var e6 = i3[n3];
      return ++t3 < r3 && (n3 = s2[n3]), { done: false, value: e6 };
    });
  }, i2.prototype.entries = function() {
    var t3 = 0, r3 = this.size, n3 = this.head, i3 = this.K, s2 = this.V, o2 = this.forward;
    return new e5(function() {
      if (t3 >= r3) return { done: true };
      var e6 = i3[n3], a2 = s2[n3];
      return ++t3 < r3 && (n3 = o2[n3]), { done: false, value: [e6, a2] };
    });
  }, typeof Symbol < "u" && (i2.prototype[Symbol.iterator] = i2.prototype.entries), i2.prototype.inspect = function() {
    for (var e6, t3 = /* @__PURE__ */ new Map(), r3 = this.entries(); !(e6 = r3.next()).done; ) t3.set(e6.value[0], e6.value[1]);
    return Object.defineProperty(t3, "constructor", { value: i2, enumerable: false }), t3;
  }, typeof Symbol < "u" && (i2.prototype[Symbol.for("nodejs.util.inspect.custom")] = i2.prototype.inspect), i2.from = function(e6, r3, s2, o2) {
    if (arguments.length < 2) {
      if ("number" != typeof (o2 = n2.guessLength(e6))) throw new Error("mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.");
    } else 2 === arguments.length && (o2 = r3, r3 = null, s2 = null);
    var a2 = new i2(r3, s2, o2);
    return t2(e6, function(e7, t3) {
      a2.set(t3, e7);
    }), a2;
  }, $ = i2;
}
function j() {
  if (M) return K;
  M = 1;
  const { isServerSide: e5 } = d();
  let t2;
  e5 && (t2 = function() {
    if (l$1) return c$1;
    l$1 = 1;
    const e6 = g(), t3 = y$1(), { findNotMatching: r3, randomSubset: n3, abstractLogging: i2 } = d();
    return c$1 = class extends t3 {
      constructor(e7 = {}) {
        if (!e7.client || "object" != typeof e7.client) throw new Error("Redis client is required");
        if (super(e7), e7.invalidation && e7.invalidation.referencesTTL && ("number" != typeof e7.invalidation.referencesTTL || e7.invalidation.referencesTTL < 1)) throw new Error("invalidation.referencesTTL must be a positive integer greater than 1");
        this.log = e7.log || i2(), this.store = e7.client, this.invalidation = !!e7.invalidation, this.referencesTTL = e7.invalidation && e7.invalidation.referencesTTL || 60;
      }
      getReferenceKeyLabel(e7) {
        return `r:${e7}`;
      }
      getKeyReferenceLabel(e7) {
        return `k:${e7}`;
      }
      async get(e7) {
        this.log.debug({ msg: "acd/storage/redis.get", key: e7 });
        try {
          const t4 = await this.store.get(e7);
          if (!t4) {
            if (!this.invalidation) return;
            return void this.clearReferences(e7);
          }
          return JSON.parse(t4);
        } catch (t4) {
          this.log.error({ msg: "acd/storage/redis.get error", err: t4, key: e7 });
        }
      }
      async getTTL(e7) {
        this.log.debug({ msg: "acd/storage/memory.getTTL", key: e7 });
        let t4 = await this.store.pttl(e7);
        return t4 < 0 ? 0 : (t4 = Math.ceil(t4 / 1e3), t4);
      }
      async set(t4, n4, i3, s2) {
        if (this.log.debug({ msg: "acd/storage/redis.set key", key: t4, value: n4, ttl: i3, references: s2 }), (i3 = Number(i3)) && !(i3 < 0)) try {
          if (await this.store.set(t4, e6(n4), "EX", i3), !s2 || s2.length < 1) return;
          if (!this.invalidation) return void this.log.warn({ msg: "acd/storage/redis.set, invalidation is disabled, references are useless", key: t4, references: s2 });
          const o2 = [], a2 = await this.store.smembers(this.getKeyReferenceLabel(t4));
          if (this.log.debug({ msg: "acd/storage/redis.set current references", key: t4, currentReferences: a2 }), a2.length > 1) {
            a2.sort(), s2.sort();
            const e7 = r3(s2, a2);
            for (const r4 of e7) o2.push(["srem", this.getReferenceKeyLabel(r4), t4]);
            o2.push(["del", this.getKeyReferenceLabel(t4)]);
          }
          const c2 = a2.length > 1 ? r3(a2, s2) : s2;
          this.log.debug({ msg: "acd/storage/redis.set references to add", key: t4, referencesToAdd: c2 });
          for (let e7 = 0; e7 < c2.length; e7++) {
            const r4 = c2[e7], n5 = this.getReferenceKeyLabel(r4);
            o2.push(["sadd", n5, t4]), o2.push(["expire", n5, this.referencesTTL]);
          }
          const l2 = this.getKeyReferenceLabel(t4);
          o2.push(["sadd", l2, s2]), o2.push(["expire", l2, i3]), this.log.debug({ msg: "acd/storage/redis.set references writes", writes: o2 }), await this.store.pipeline(o2).exec();
        } catch (e7) {
          this.log.error({ msg: "acd/storage/redis.set error", err: e7, key: t4, ttl: i3, references: s2 });
        }
      }
      async remove(e7) {
        this.log.debug({ msg: "acd/storage/redis.remove", key: e7 });
        try {
          const t4 = await this.store.del(e7) > 0;
          return t4 && this.invalidation && await this.clearReferences(e7), t4;
        } catch (t4) {
          this.log.error({ msg: "acd/storage/redis.remove error", err: t4, key: e7 });
        }
      }
      async invalidate(e7) {
        if (!this.invalidation) return this.log.warn({ msg: "acd/storage/redis.invalidate, exit due invalidation is disabled" }), [];
        this.log.debug({ msg: "acd/storage/redis.invalidate", references: e7 });
        try {
          return Array.isArray(e7) ? await this._invalidateReferences(e7) : await this._invalidateReference(e7);
        } catch (t4) {
          return this.log.error({ msg: "acd/storage/redis.invalidate error", err: t4, references: e7 }), [];
        }
      }
      async _invalidateReferences(e7, t4 = true) {
        const r4 = e7.map((e8) => ["smembers", t4 ? this.getReferenceKeyLabel(e8) : e8]), n4 = await this.store.pipeline(r4).exec();
        this.log.debug({ msg: "acd/storage/redis._invalidateReferences keys", keys: n4 });
        const i3 = [], s2 = [];
        for (let e8 = 0; e8 < n4.length; e8++) {
          const t5 = n4[e8][1];
          if (t5) {
            this.log.debug({ msg: "acd/storage/redis._invalidateReferences got keys to be invalidated", keys: t5 });
            for (let e9 = 0; e9 < t5.length; e9++) {
              const r5 = t5[e9];
              this.log.debug({ msg: "acd/storage/redis._invalidateReferences del key" + r5 }), s2.push(r5), i3.push(["del", r5]);
            }
          }
        }
        return await this.store.pipeline(i3).exec(), await this.clearReferences(s2), s2;
      }
      async _invalidateReference(e7) {
        let t4;
        if (e7.includes("*")) {
          const t5 = await this.store.keys(this.getReferenceKeyLabel(e7));
          return this._invalidateReferences(t5, false);
        }
        t4 = await this.store.smembers(this.getReferenceKeyLabel(e7)), this.log.debug({ msg: "acd/storage/redis._invalidateReference keys", keys: t4 });
        const r4 = [], n4 = [];
        for (let e8 = 0; e8 < t4.length; e8++) {
          const i3 = t4[e8];
          this.log.debug({ msg: "acd/storage/redis._invalidateReference del key" + i3 }), n4.push(i3), r4.push(["del", i3]);
        }
        return await this.store.pipeline(r4).exec(), await this.clearReferences(n4), n4;
      }
      async clear(e7) {
        this.log.debug({ msg: "acd/storage/redis.clear", name: e7 });
        try {
          if (!e7) return void await this.store.flushall();
          const t4 = await this.store.keys(`${e7}*`);
          this.log.debug({ msg: "acd/storage/redis.clear keys", keys: t4 });
          const r4 = t4.map((e8) => ["del", e8]);
          if (await this.store.pipeline(r4).exec(), !this.invalidation) return;
          await this.clearReferences(t4);
        } catch (t4) {
          this.log.error({ msg: "acd/storage/redis.clear error", err: t4, name: e7 });
        }
      }
      async refresh() {
        try {
          await this.store.flushall();
        } catch (e7) {
          this.log.error({ msg: "acd/storage/redis.refresh error", err: e7 });
        }
      }
      async clearReferences(e7) {
        try {
          if (!e7) return void this.log.warn({ msg: "acd/storage/redis.clearReferences invalid call due to empty key" });
          Array.isArray(e7) || (e7 = [e7]);
          const t4 = e7.map((e8) => ["smembers", this.getKeyReferenceLabel(e8)]), r4 = await this.store.pipeline(t4).exec();
          this.log.debug({ msg: "acd/storage/redis.clearReferences references", keys: e7, referencesKeys: r4 });
          const n4 = {};
          for (let t5 = 0; t5 < e7.length; t5++) {
            for (let i4 = 0; i4 < r4[t5][1].length; i4++) {
              const s2 = this.getReferenceKeyLabel(r4[t5][1][i4]);
              n4[s2] || (n4[s2] = ["srem", s2, e7]);
            }
            const i3 = this.getKeyReferenceLabel(e7[t5]);
            n4[i3] = ["del", i3];
          }
          this.log.debug({ msg: "acd/storage/redis.clearReferences writes pipeline", writes: n4 }), await this.store.pipeline(Object.values(n4)).exec();
        } catch (e8) {
          this.log.error({ msg: "acd/storage/redis.clearReferences error", err: e8 });
        }
      }
      async gc(e7 = "lazy", t4 = {}) {
        if (this.log.debug({ msg: "acd/storage/redis.gc", mode: e7, options: t4 }), !this.invalidation) return void this.log.warn({ msg: "acd/storage/redis.gc does not run due to invalidation is disabled" });
        "strict" !== e7 && "lazy" !== e7 && (e7 = "lazy");
        const r4 = { references: { scanned: [], removed: [] }, keys: { scanned: /* @__PURE__ */ new Set(), removed: /* @__PURE__ */ new Set() }, loops: 0, cursor: 0, error: null };
        try {
          let i3 = 0, s2 = 64;
          if (t4.chunk && ("number" != typeof t4.chunk || t4.chunk < 1)) return r4.error = new Error("chunk must be a positive integer greater than 1"), r4;
          if (t4.lazy) {
            if (t4.lazy.chunk) {
              if ("number" != typeof t4.lazy.chunk || t4.lazy.chunk < 1) return r4.error = new Error("lazy.chunk must be a positive integer greater than 1"), r4;
              s2 = t4.lazy.chunk;
            }
            if (t4.lazy.cursor) {
              if ("number" != typeof t4.lazy.cursor || t4.lazy.cursor < 0) return r4.error = new Error("lazy.cursor must be a positive integer greater than 0"), r4;
              i3 = t4.lazy.cursor;
            }
          }
          const o2 = t4.chunk || 64, a2 = Math.min(s2, o2), c2 = i3;
          let l2 = -1, u2 = -1;
          do {
            r4.loops++;
            const t5 = await this.store.scan(i3, "match", "r:*", "count", a2);
            i3 = Number(t5[0]), l2 = t5[1].length;
            const o3 = "lazy" === e7 ? n3(t5[1], s2) : t5[1];
            r4.references.scanned = r4.references.scanned.concat(o3);
            let c3 = [];
            for (let e8 = 0; e8 < o3.length; e8++) {
              const t6 = o3[e8];
              c3.push(["smembers", t6]);
            }
            const f2 = await this.store.pipeline(c3).exec(), h2 = {}, g2 = {};
            for (let e8 = 0; e8 < f2.length; e8++) {
              const t6 = f2[e8], n4 = o3[e8];
              g2[n4] = t6[1];
              for (let e9 = 0; e9 < t6[1].length; e9++) {
                const i4 = t6[1][e9];
                h2[i4] ? h2[i4].push(n4) : h2[i4] = [n4], r4.keys.scanned.add(i4);
              }
            }
            const d2 = Object.keys(h2);
            c3 = d2.map((e8) => ["exists", e8]);
            const y2 = await this.store.pipeline(c3).exec(), m2 = {};
            for (let e8 = 0; e8 < d2.length; e8++) {
              const t6 = d2[e8];
              if (1 !== y2[e8][1]) for (let e9 = 0; e9 < h2[t6].length; e9++) {
                const n4 = h2[t6][e9];
                m2[n4] ? m2[n4].push(t6) : m2[n4] = [t6], r4.keys.removed.add(t6);
              }
            }
            const p2 = Object.keys(m2), v2 = [];
            for (let e8 = 0; e8 < p2.length; e8++) {
              const t6 = p2[e8];
              g2[t6].length === m2[t6].length ? (v2.push(["del", t6]), r4.references.removed.push(t6)) : v2.push(["srem", t6, m2[t6]]);
            }
            if (await this.store.pipeline(v2).exec(), u2 = v2.length, "lazy" === e7 && r4.references.scanned.length >= s2) break;
          } while (c2 !== i3 && l2 > 0 && u2 > 0);
          r4.cursor = i3, r4.keys.scanned = Array.from(r4.keys.scanned), r4.keys.removed = Array.from(r4.keys.removed);
        } catch (e8) {
          this.log.error({ msg: "acd/storage/redis.gc error", err: e8 }), r4.error = e8;
        }
        return r4;
      }
    };
  }());
  const r2 = function() {
    if (O) return T;
    O = 1;
    const e6 = N(), { abstractLogging: t3 } = d(), r3 = y$1(), { findMatchingIndexes: n3, findNotMatching: i2, bsearchIndex: s2, wildcardMatch: o2 } = d(), a2 = typeof globalThis.setImmediate < "u" ? globalThis.setImmediate : (e7, ...t4) => setTimeout(e7, 0, ...t4);
    let c2;
    function l2() {
      if (void 0 !== c2) return c2;
      c2 = Math.floor(Date.now() / 1e3);
      const e7 = setTimeout(u2, 1e3);
      return "function" == typeof e7.unref && e7.unref(), c2;
    }
    function u2() {
      c2 = void 0;
    }
    return T = class extends r3 {
      constructor(e7 = {}) {
        if (e7.size && ("number" != typeof e7.size || e7.size < 1)) throw new Error("size must be a positive integer greater than 0");
        super(e7), this.size = e7.size || 1024, this.log = e7.log || t3(), this.invalidation = e7.invalidation || false, this.init();
      }
      init() {
        this.store = new e6(this.size), this.invalidation && (this.keysReferences = /* @__PURE__ */ new Map(), this.referencesKeys = /* @__PURE__ */ new Map());
      }
      get(e7) {
        this.log.debug({ msg: "acd/storage/memory.get", key: e7 });
        const t4 = this.store.get(e7);
        if (t4) {
          if (this.log.debug({ msg: "acd/storage/memory.get, entry", entry: t4, now: l2() }), t4.start + t4.ttl > l2()) return this.log.debug({ msg: "acd/storage/memory.get, key is NOT expired", key: e7, entry: t4 }), t4.value;
          this.log.debug({ msg: "acd/storage/memory.get, key is EXPIRED", key: e7, entry: t4 }), a2(() => this.remove(e7));
        }
      }
      getTTL(e7) {
        this.log.debug({ msg: "acd/storage/memory.getTTL", key: e7 });
        const t4 = this.store.peek(e7);
        let r4 = 0;
        return t4 && (r4 = t4.start + t4.ttl - l2(), r4 < 0 && (r4 = 0)), r4;
      }
      set(e7, t4, r4, n4) {
        if (this.log.debug({ msg: "acd/storage/memory.set", key: e7, value: t4, ttl: r4, references: n4 }), !(r4 = Number(r4)) || r4 < 0) return;
        const o3 = this.store.has(e7), a3 = this.store.setpop(e7, { value: t4, ttl: r4, start: l2() });
        if (this.log.debug({ msg: "acd/storage/memory.set, evicted", removed: a3 }), a3 && a3.evicted && (this.log.debug({ msg: "acd/storage/memory.set, remove evicted key", key: a3.key }), this._removeReferences([a3.key])), !n4 || n4.length < 1) return;
        if (!this.invalidation) return void this.log.warn({ msg: "acd/storage/memory.set, invalidation is disabled, references are useless" });
        let c3;
        if (n4 = [...new Set(n4)], o3 && (c3 = this.keysReferences.get(e7), this.log.debug({ msg: "acd/storage/memory.set, current keys-references", key: e7, references: c3 }), c3)) {
          c3.sort(), n4.sort();
          const t5 = i2(n4, c3);
          for (const r5 of t5) {
            const t6 = this.referencesKeys.get(r5);
            if (!t6) continue;
            const n5 = s2(t6, e7);
            if (!(n5 < 0)) {
              if (t6.splice(n5, 1), t6.length < 1) {
                this.referencesKeys.delete(r5);
                continue;
              }
              this.referencesKeys.set(r5, t6);
            }
          }
        }
        const u3 = c3 ? i2(c3, n4) : n4;
        for (let t5 = 0; t5 < u3.length; t5++) {
          const r5 = u3[t5];
          let n5 = this.referencesKeys.get(r5);
          n5 ? (this.log.debug({ msg: "acd/storage/memory.set, add reference-key", key: e7, reference: r5 }), n5.push(e7)) : n5 = [e7], this.log.debug({ msg: "acd/storage/memory.set, set reference-keys", keys: n5, reference: r5 }), this.referencesKeys.set(r5, n5);
        }
        this.keysReferences.set(e7, n4);
      }
      remove(e7) {
        this.log.debug({ msg: "acd/storage/memory.remove", key: e7 });
        const t4 = this._removeKey(e7);
        return this._removeReferences([e7]), t4;
      }
      _removeKey(e7) {
        return this.log.debug({ msg: "acd/storage/memory._removeKey", key: e7 }), !!this.store.has(e7) && (this.store.set(e7, void 0), true);
      }
      _removeReferences(e7) {
        if (!this.invalidation) return;
        this.log.debug({ msg: "acd/storage/memory._removeReferences", keys: e7 });
        const t4 = /* @__PURE__ */ new Set();
        for (let r4 = 0; r4 < e7.length; r4++) {
          const n4 = e7[r4], i3 = this.keysReferences.get(n4);
          if (i3) {
            for (let e8 = 0; e8 < i3.length; e8++) t4.add(i3[e8]);
            this.log.debug({ msg: "acd/storage/memory._removeReferences, delete key-references", key: n4 }), this.keysReferences.delete(n4);
          }
        }
        this._removeReferencesKeys([...t4], e7);
      }
      _removeReferencesKeys(e7, t4) {
        t4.sort(), this.log.debug({ msg: "acd/storage/memory._removeReferencesKeys", references: e7, keys: t4 });
        for (let r4 = 0; r4 < e7.length; r4++) {
          const i3 = e7[r4], s3 = this.referencesKeys.get(i3);
          if (this.log.debug({ msg: "acd/storage/memory._removeReferencesKeys, get reference-key", reference: i3, keys: t4, referencesKeys: s3 }), !s3) continue;
          const o3 = n3(t4, s3);
          if (this.log.debug({ msg: "acd/storage/memory._removeReferencesKeys, removing", reference: i3, referencesToRemove: o3, referencesKeys: s3 }), o3.length !== s3.length) for (let e8 = o3.length - 1; e8 >= 0; e8--) this.log.debug({ msg: "acd/storage/memory._removeReferencesKeys, remove", reference: i3, referencesKeys: s3, at: o3[e8] }), s3.splice(o3[e8], 1);
          else this.log.debug({ msg: "acd/storage/memory._removeReferencesKeys, delete", reference: i3 }), this.referencesKeys.delete(i3);
        }
      }
      invalidate(e7) {
        return this.invalidation ? (this.log.debug({ msg: "acd/storage/memory.invalidate", references: e7 }), Array.isArray(e7) ? this._invalidateReferences(e7) : this._invalidateReference(e7)) : (this.log.warn({ msg: "acd/storage/memory.invalidate, exit due invalidation is disabled" }), []);
      }
      _invalidateReferences(e7) {
        const t4 = [];
        for (let r4 = 0; r4 < e7.length; r4++) {
          const n4 = e7[r4], i3 = this.referencesKeys.get(n4);
          if (this.log.debug({ msg: "acd/storage/memory._invalidateReferences, remove keys on reference", reference: n4, keys: i3 }), i3) {
            for (let e8 = 0; e8 < i3.length; e8++) {
              const r5 = i3[e8];
              this.log.debug({ msg: "acd/storage/memory._invalidateReferences, remove key on reference", reference: n4, key: r5 }), this._removeKey(r5) && t4.push(r5);
            }
            this.log.debug({ msg: "acd/storage/memory._invalidateReferences, remove references of", reference: n4, keys: i3 }), this._removeReferences([...i3]);
          }
        }
        return t4;
      }
      _invalidateReference(e7) {
        if (e7.includes("*")) {
          const t5 = [];
          for (const r5 of this.referencesKeys.keys()) o2(e7, r5) && t5.push(r5);
          return this._invalidateReferences(t5);
        }
        const t4 = this.referencesKeys.get(e7), r4 = [];
        if (this.log.debug({ msg: "acd/storage/memory._invalidateReference, remove keys on reference", reference: e7, keys: t4 }), !t4) return r4;
        for (let n4 = 0; n4 < t4.length; n4++) {
          const i3 = t4[n4];
          this.log.debug({ msg: "acd/storage/memory._invalidateReference, remove key on reference", reference: e7, key: i3 }), this._removeKey(i3) && r4.push(i3);
        }
        return this.log.debug({ msg: "acd/storage/memory._invalidateReference, remove references of", reference: e7, keys: t4 }), this._removeReferences([...t4]), r4;
      }
      clear(e7) {
        if (this.log.debug({ msg: "acd/storage/memory.clear", name: e7 }), !e7) {
          if (this.store.clear(), !this.invalidation) return;
          return this.referencesKeys.clear(), void this.keysReferences.clear();
        }
        const t4 = [];
        this.store.forEach((r5, n4) => {
          this.log.debug({ msg: "acd/storage/memory.clear, iterate key", key: n4 }), 0 === n4.indexOf(e7) && (this.log.debug({ msg: "acd/storage/memory.clear, remove key", key: n4 }), t4.push(n4));
        });
        const r4 = [];
        for (let e8 = 0; e8 < t4.length; e8++) this._removeKey(t4[e8]) && r4.push(t4[e8]);
        return this._removeReferences(r4), r4;
      }
      refresh() {
        this.log.debug({ msg: "acd/storage/memory.refresh" }), this.init();
      }
    };
  }(), n2 = "redis";
  return K = function(i2, s2) {
    if (!e5 && i2 === n2) throw new Error("Redis storage is not supported in the browser");
    return i2 === n2 ? new t2(s2) : new r2(s2);
  };
}
function P() {
  if (_) return r$1;
  _ = 1;
  const { kValues: n2, kStorage: i2, kStorages: s2, kTransfromer: o2, kTTL: a2, kOnDedupe: c2, kOnError: l2, kOnHit: u2, kOnMiss: f2, kStale: h2 } = function() {
    if (t) return e;
    t = 1;
    const r2 = Symbol("values"), n3 = Symbol("kStorage"), i3 = Symbol("kStorages"), s3 = Symbol("kTransformer"), o3 = Symbol("kTTL"), a3 = Symbol("kOnDedupe"), c3 = Symbol("kOnError"), l3 = Symbol("kOnHit"), u3 = Symbol("kOnMiss"), f3 = Symbol("kStale");
    return e = { kValues: r2, kStorage: n3, kStorages: i3, kTransfromer: s3, kTTL: o3, kOnDedupe: a3, kOnError: c3, kOnHit: l3, kOnMiss: u3, kStale: f3 };
  }(), d2 = g(), y2 = j();
  class m2 {
    constructor(e5, t2, r2, n3, i3, s3, o3, a3, c3, l3, u3, f3) {
      this.dedupes = /* @__PURE__ */ new Map(), this.func = e5, this.name = t2, this.serialize = r2, this.references = n3, this.storage = i3, this.transformer = s3, this.ttl = o3, this.onDedupe = a3, this.onError = c3, this.onHit = l3, this.onMiss = u3, this.stale = f3;
    }
    getKey(e5) {
      const t2 = this.serialize ? this.serialize(e5) : e5;
      return "string" == typeof t2 ? t2 : d2(t2);
    }
    getStorageKey(e5) {
      return `${this.name}~${e5}`;
    }
    getStorageName() {
      return `${this.name}~`;
    }
    add(e5) {
      try {
        const t2 = this.getKey(e5);
        let r2 = this.dedupes.get(t2);
        return r2 ? this.onDedupe(t2) : (r2 = new p2(), this.buildPromise(r2, e5, t2), this.dedupes.set(t2, r2)), r2.promise;
      } catch (e6) {
        this.onError(e6);
      }
    }
    async wrapFunction(e5, t2) {
      const r2 = this.getStorageKey(t2);
      if (this.ttl > 0 || "function" == typeof this.ttl) {
        const n3 = await this.get(r2);
        if (void 0 !== n3) {
          this.onHit(t2);
          const i3 = "function" == typeof this.stale ? this.stale(n3) : this.stale;
          return i3 > 0 && await this.storage.getTTL(r2) <= i3 && this._wrapFunction(r2, e5, t2).catch(v2), n3;
        }
        this.onMiss(t2);
      }
      return this._wrapFunction(r2, e5, t2);
    }
    async _wrapFunction(e5, t2, r2) {
      const n3 = await this.func(t2, r2), i3 = "function" == typeof this.stale ? this.stale(n3) : this.stale;
      let s3 = "function" == typeof this.ttl ? this.ttl(n3) : this.ttl;
      if (null == s3 || "number" != typeof s3 || !Number.isInteger(s3)) return this.onError(new Error("ttl must be an integer")), n3;
      if (s3 += i3, s3 < 1) return n3;
      if (!this.references) return await this.set(e5, n3, s3), n3;
      try {
        let i4 = this.references(t2, r2, n3), o3 = n3;
        i4 && "function" == typeof i4.then && (i4 = await i4), this.transformer && (o3 = this.transformer.serialize(n3)), await this.storage.set(e5, o3, s3, i4);
      } catch (e6) {
        this.onError(e6);
      }
      return n3;
    }
    buildPromise(e5, t2, r2) {
      e5.promise = this.wrapFunction(t2, r2), e5.promise.then((e6) => (this.dedupes.delete(r2), e6)).catch((e6) => {
        this.onError(e6), this.dedupes.delete(r2);
        const t3 = this.storage.remove(this.getStorageKey(r2));
        t3 && "function" == typeof t3.catch && t3.catch(v2);
      });
    }
    async clear(e5) {
      if (e5) {
        const t2 = this.getKey(e5);
        return this.dedupes.delete(t2), void await this.storage.remove(this.getStorageKey(t2));
      }
      await this.storage.clear(this.getStorageName()), this.dedupes.clear();
    }
    async get(e5) {
      const t2 = await this.storage.get(e5);
      return this.transformer && t2 ? await this.transformer.deserialize(t2) : t2;
    }
    async set(e5, t2, r2, n3) {
      return this.transformer && (t2 = this.transformer.serialize(t2)), this.storage.set(e5, t2, r2, n3);
    }
    async invalidate(e5) {
      return this.storage.invalidate(e5);
    }
  }
  class p2 {
    constructor() {
      this.promise = null;
    }
  }
  function v2() {
  }
  return r$1.Cache = class {
    constructor(e5 = {}) {
      if (!e5.storage) throw new Error("storage is required");
      if (e5.ttl && "number" == typeof e5.ttl && (e5.ttl < 0 || !Number.isInteger(e5.ttl))) throw new Error("ttl must be a positive integer greater than 0");
      if (e5.onDedupe && "function" != typeof e5.onDedupe) throw new Error("onDedupe must be a function");
      if (e5.onError && "function" != typeof e5.onError) throw new Error("onError must be a function");
      if (e5.onHit && "function" != typeof e5.onHit) throw new Error("onHit must be a function");
      if (e5.onMiss && "function" != typeof e5.onMiss) throw new Error("onMiss must be a function");
      if ("number" == typeof e5.stale && !(Math.floor(e5.stale) === e5.stale && e5.stale >= 0)) throw new Error("stale must be an integer greater or equal to 0");
      this[n2] = {}, this[i2] = e5.storage, this[s2] = /* @__PURE__ */ new Map(), this[s2].set("_default", e5.storage), this[o2] = e5.transformer, this[a2] = e5.ttl || 0, this[c2] = e5.onDedupe || v2, this[l2] = e5.onError || v2, this[u2] = e5.onHit || v2, this[f2] = e5.onMiss || v2, this[h2] = e5.stale || 0;
    }
    define(e5, t2, r2) {
      if ("function" == typeof t2 && (r2 = t2, t2 = {}), e5 && this[e5]) throw new Error(`${e5} is already defined in the cache or it is a forbidden name`);
      if (t2 = t2 || {}, "function" != typeof r2) throw new TypeError(`Missing the function parameter for '${e5}'`);
      const g2 = t2.serialize;
      if (g2 && "function" != typeof g2) throw new TypeError("serialize must be a function");
      const d3 = t2.references;
      if (d3 && "function" != typeof d3) throw new TypeError("references must be a function");
      if ("function" != typeof t2.ttl && t2.ttl && ("number" != typeof t2.ttl || t2.ttl < 0 || !Number.isInteger(t2.ttl))) throw new Error("ttl must be a positive integer greater than 0");
      let p3;
      t2.storage ? (p3 = y2(t2.storage.type, t2.storage.options), this[s2].set(e5, p3)) : p3 = this[i2];
      const v3 = void 0 !== t2.ttl ? t2.ttl : this[a2], b2 = void 0 !== t2.stale ? t2.stale : this[h2], w2 = t2.onDedupe || this[c2], k2 = t2.onError || this[l2], S2 = t2.onHit || this[u2], E2 = t2.onMiss || this[f2], R2 = t2.transformer || this[o2], $2 = new m2(r2, e5, g2, d3, p3, R2, v3, w2, k2, S2, E2, b2);
      return this[n2][e5] = $2, this[e5] = $2.add.bind($2), this;
    }
    async clear(e5, t2) {
      if (e5) {
        if (!this[n2][e5]) throw new Error(`${e5} is not defined in the cache`);
        return void await this[n2][e5].clear(t2);
      }
      const r2 = [];
      for (const e6 of Object.values(this[n2])) r2.push(e6.clear());
      await Promise.all(r2);
    }
    async get(e5, t2) {
      if (!this[n2][e5]) throw new Error(`${e5} is not defined in the cache`);
      return this[n2][e5].get(t2);
    }
    async set(e5, t2, r2, i3, s3) {
      if (!this[n2][e5]) throw new Error(`${e5} is not defined in the cache`);
      return this[n2][e5].set(t2, r2, i3, s3);
    }
    async invalidate(e5, t2) {
      if (!this[n2][e5]) throw new Error(`${e5} is not defined in the cache`);
      return this[n2][e5].invalidate(t2);
    }
    async invalidateAll(e5, t2 = "_default") {
      if (!this[s2].has(t2)) throw new Error(`${t2} storage is not defined in the cache`);
      await this[s2].get(t2).invalidate(e5);
    }
  }, r$1;
}
var V = function() {
  if (x) return z;
  x = 1;
  const { Cache: e5 } = P(), t2 = j();
  return z = { Cache: e5, createCache: function(r2) {
    r2 ? r2.storage || (r2.storage = { type: "memory" }) : r2 = { storage: { type: "memory" } };
    const n2 = t2(r2.storage.type, r2.storage.options);
    return new e5({ ...r2, storage: n2 });
  }, createStorage: t2 };
}();
let F = 0, I = [];
let C = Symbol("clean"), D = [], U = (e5, t2) => {
  let r2 = [], n2 = { get: () => (n2.lc || n2.listen(() => {
  })(), n2.value), l: t2 || 0, lc: 0, listen: (e6, t3) => (n2.lc = r2.push(e6, t3 || n2.l) / 2, () => {
    let t4 = r2.indexOf(e6);
    ~t4 && (r2.splice(t4, 2), --n2.lc || n2.off());
  }), notify(e6, t3) {
    let i2 = !D.length;
    for (let i3 = 0; i3 < r2.length; i3 += 2) D.push(r2[i3], r2[i3 + 1], n2.value, e6, t3);
    if (i2) {
      for (let e7 = 0; e7 < D.length; e7 += 5) {
        let t4;
        for (let r3 = e7 + 1; !t4 && (r3 += 5) < D.length; ) D[r3] < D[e7 + 1] && (t4 = D.push(D[e7], D[e7 + 1], D[e7 + 2], D[e7 + 3], D[e7 + 4]));
        t4 || D[e7](D[e7 + 2], D[e7 + 3], D[e7 + 4]);
      }
      D.length = 0;
    }
  }, off() {
  }, set(e6) {
    let t3 = n2.value;
    t3 !== e6 && (n2.value = e6, n2.notify(t3));
  }, subscribe(e6, t3) {
    let r3 = n2.listen(e6, t3);
    return e6(n2.value), r3;
  }, value: e5 };
  return "production" !== process.env.NODE_ENV && (n2[C] = () => {
    r2 = [], n2.lc = 0, n2.off();
  }), n2;
};
const J = typeof document > "u" ? "server" : "browser";
function H(e5) {
  return e5.withConfig({ allowReconfigure: false });
}
const q = (e5) => {
  const { ssr: t2 = false, tag: r2 = "core-loader" } = e5;
  if (t2 && e5.client) throw new TypeError("`client` option is not allowed when `ssr: true`, use `setServerClient` from your server entry point instead");
  if (!t2 && false === e5.client) throw new TypeError("You must set `ssr: true` when `client: false` is used");
  if (!t2 && !e5.client) throw new TypeError("`client` is required");
  let n2 = t2 ? void 0 : H(e5.client);
  function i2(e6) {
    return V.createCache().define("fetch", async (t3) => {
      if (!e6) throw new Error("You have to set the Sanity client with `setServerClient` before any data fetching is done");
      const { query: n3, params: i3 = {}, perspective: s3, useCdn: o3, stega: a3 } = JSON.parse(t3), { result: c3, resultSourceMap: l3 } = await e6.fetch(n3, i3, { tag: r2, filterResponse: false, perspective: s3, useCdn: o3, stega: a3 });
      return { result: c3, resultSourceMap: l3 };
    });
  }
  function s2() {
    const e6 = n2?.config().perspective || "published";
    return o2.instance = i2(n2), { hydrate: (t3, r3, n3) => ({ loading: void 0 === n3?.data || void 0 === n3?.sourceMap, error: void 0, data: n3?.data, sourceMap: n3?.sourceMap, perspective: e6 }), fetch: (t3, r3, n3, i3) => {
      if (i3.signal.aborted) return;
      const s3 = (F += 1, () => {
        if (F -= 1, 0 === F) {
          let e7 = I;
          I = [];
          for (let t4 of e7) t4();
        }
      });
      n3.setKey("loading", true), n3.setKey("error", void 0), o2.instance.fetch(JSON.stringify({ query: t3, params: r3 })).then((t4) => {
        i3.signal.aborted || (n3.setKey("data", t4.result), n3.setKey("sourceMap", t4.resultSourceMap), n3.setKey("perspective", e6));
      }).catch((e7) => {
        n3.setKey("error", e7);
      }).finally(() => {
        n3.setKey("loading", false), s3();
      });
    } };
  }
  const o2 = { instance: i2(n2) }, a2 = U(n2 ? s2() : void 0), c2 = ((e6) => {
    const { ssr: t3, setFetcher: r3 } = e6;
    return (n3) => {
      if ("server" === J) throw new Error("Live mode is not supported in server environments");
      if (t3 && !n3.client) throw new Error("The `client` option in `enableLiveMode` is required");
      const i3 = n3.client || e6.client || void 0, s3 = new AbortController();
      let o3;
      return import("./enableLiveMode.js").then(({ enableLiveMode: e7 }) => {
        s3.signal.aborted || (o3 = e7({ ...n3, client: i3, setFetcher: r3, ssr: t3 }));
      }), () => {
        s3.abort(), o3?.();
      };
    };
  })({ client: n2 || void 0, ssr: t2, setFetcher: (e6) => {
    const t3 = a2.get();
    return a2.set(e6), () => a2.set(t3);
  } }), l2 = { instance: void 0, canPreviewDrafts: false };
  return { createFetcherStore: (e6, t3 = {}, r3) => {
    const n3 = a2.get(), i3 = ((e7 = {}) => {
      let t4 = U(e7);
      return t4.setKey = function(e8, r4) {
        let n4 = t4.value;
        typeof r4 > "u" && e8 in t4.value ? (t4.value = { ...t4.value }, delete t4.value[e8], t4.notify(n4, e8)) : t4.value[e8] !== r4 && (t4.value = { ...t4.value, [e8]: r4 }, t4.notify(n4, e8));
      }, t4;
    })(n3 ? n3.hydrate(e6, t3, r3) : { loading: false, error: typeof r3?.data > "u" ? new Error("The `initial` option is required when `ssr: true`") : void 0, data: r3?.data, sourceMap: r3?.sourceMap, perspective: r3?.perspective });
    return o3 = () => {
      let r4 = new AbortController();
      const n4 = a2.subscribe((n5) => {
        !n5 || r4.signal.aborted || (r4.abort(), r4 = new AbortController(), n5.fetch(e6, t3, i3, r4));
      });
      return () => {
        r4.abort(), n4();
      };
    }, l3 = (e7) => {
      let t4 = o3(e7);
      t4 && s3.events[6].push(t4);
    }, u2 = 5, f2 = (e7) => {
      let t4 = s3.listen;
      s3.listen = (...r5) => (!s3.lc && !s3.active && (s3.active = true, e7()), t4(...r5));
      let r4 = s3.off;
      if (s3.events[6] = [], s3.off = () => {
        r4(), setTimeout(() => {
          if (s3.active && !s3.lc) {
            s3.active = false;
            for (let e8 of s3.events[6]) e8();
            s3.events[6] = [];
          }
        }, 1e3);
      }, "production" !== process.env.NODE_ENV) {
        let e8 = s3[C];
        s3[C] = () => {
          for (let e9 of s3.events[6]) e9();
          s3.events[6] = [], s3.active = false, e8();
        };
      }
      return () => {
        s3.listen = t4, s3.off = r4;
      };
    }, (c3 = s3 = i3).events = c3.events || {}, c3.events[u2 + 10] || (c3.events[u2 + 10] = f2((e7) => {
      c3.events[u2].reduceRight((e8, t4) => (t4(e8), e8), { shared: {}, ...e7 });
    })), c3.events[u2] = c3.events[u2] || [], c3.events[u2].push(l3), i3;
    var s3, o3, c3, l3, u2, f2;
  }, enableLiveMode: c2, setServerClient: (e6) => {
    if ("server" !== J) throw new Error("`setServerClient` can only be called in server environments, detected: " + JSON.stringify(J));
    if (!t2) throw new Error("`setServerClient` can only be called when `ssr: true`");
    l2.instance = n2 = H(e6), l2.canPreviewDrafts = !!n2.config().token, a2.set(s2());
  }, unstable__cache: o2, unstable__serverClient: l2 };
};
function defineStudioUrlStore(client) {
  return writable(typeof client === "object" ? client?.config().stega.studioUrl : void 0);
}
function defineUseLiveMode({ enableLiveMode, studioUrlStore }) {
  return ({ allowStudioOrigin, client, onConnect, onDisconnect, studioUrl } = {}) => {
    if (allowStudioOrigin) {
      console.warn("`allowStudioOrigin` is deprecated and no longer needed");
    }
    studioUrlStore.set(studioUrl ?? (typeof client === "object" ? client?.config().stega.studioUrl : void 0));
    return enableLiveMode({
      client,
      onConnect,
      onDisconnect
    });
  };
}
function n$1(e5, t2, n2, s2, r2) {
  const i2 = r2 && "input" in r2 ? r2.input : n2.value, u2 = r2?.expected ?? e5.expects, a2 = r2?.received ?? function(e6) {
    let t3 = typeof e6;
    return "object" === t3 && (t3 = (e6 && Object.getPrototypeOf(e6)?.constructor?.name) ?? "null"), "string" === t3 ? `"${e6}"` : "number" === t3 || "bigint" === t3 || "boolean" === t3 ? `${e6}` : t3;
  }(i2), o2 = { kind: e5.kind, type: e5.type, input: i2, expected: u2, received: a2, message: `Invalid ${t2}: ${u2 ? `Expected ${u2} but r` : "R"}eceived ${a2}`, requirement: e5.requirement, path: r2?.path, issues: r2?.issues, lang: s2.lang, abortEarly: s2.abortEarly, abortPipeEarly: s2.abortPipeEarly, skipPipe: s2.skipPipe }, p2 = "schema" === e5.kind, c2 = e5.message ?? (e5.reference, void o2.lang) ?? (p2 ? void o2.lang : null) ?? s2.message ?? void o2.lang;
  c2 && (o2.message = "function" == typeof c2 ? c2(o2) : c2), p2 && (n2.typed = false), n2.issues ? n2.issues.push(o2) : n2.issues = [o2];
}
function s(e5) {
  return "__proto__" !== e5 && "prototype" !== e5 && "constructor" !== e5;
}
function r(e5, t2) {
  return { kind: "schema", type: "object", reference: r, expects: "Object", async: false, entries: e5, message: t2, _run(e6, t3) {
    const s2 = e6.value;
    if (s2 && "object" == typeof s2) {
      e6.typed = true, e6.value = {};
      for (const n2 in this.entries) {
        const r2 = s2[n2], i2 = this.entries[n2]._run({ typed: false, value: r2 }, t3);
        if (i2.issues) {
          const u2 = { type: "object", origin: "value", input: s2, key: n2, value: r2 };
          for (const t4 of i2.issues) t4.path ? t4.path.unshift(u2) : t4.path = [u2], e6.issues?.push(t4);
          if (e6.issues || (e6.issues = i2.issues), t3.abortEarly) {
            e6.typed = false;
            break;
          }
        }
        i2.typed || (e6.typed = false), (void 0 !== i2.value || n2 in s2) && (e6.value[n2] = i2.value);
      }
    } else n$1(this, "type", e6, t3);
    return e6;
  } };
}
function i(e5, ...t2) {
  const n2 = { kind: "schema", type: "optional", reference: i, expects: `${e5.expects} | undefined`, async: false, wrapped: e5, _run(e6, t3) {
    return void 0 === e6.value && ("default" in this && (e6.value = function(e7, t4, n3) {
      return "function" == typeof e7.default ? e7.default(t4, n3) : e7.default;
    }(this, e6, t3)), void 0 === e6.value) ? (e6.typed = true, e6) : this.wrapped._run(e6, t3);
  } };
  return 0 in t2 && (n2.default = t2[0]), n2;
}
function u(e5) {
  return { kind: "schema", type: "string", reference: u, expects: "string", async: false, message: e5, _run(e6, t2) {
    return "string" == typeof e6.value ? e6.typed = true : n$1(this, "type", e6, t2), e6;
  } };
}
function a$1(e5) {
  return null !== e5 && Array.isArray(e5);
}
function o(e5) {
  let t2 = "";
  for (const n2 of e5) "string" != typeof n2 ? "number" != typeof n2 ? a$1(n2) ? (t2 && (t2 += ":"), t2 += `${n2.join(",")}}`) : n2._key && (t2 && (t2 += ":"), t2 += `${n2._key}`) : (t2 && (t2 += ":"), t2 += `${n2}`) : (t2 && (t2 += "."), t2 += n2);
  return t2;
}
const p = function(...e5) {
  return { ...e5[0], pipe: e5, _run(t2, n2) {
    for (let s2 = 0; s2 < e5.length; s2++) {
      t2 = e5[s2]._run(t2, n2);
      const r2 = e5[s2 + 1];
      if (n2.skipPipe || t2.issues && (n2.abortEarly || n2.abortPipeEarly || "schema" === r2?.kind || "transformation" === r2?.kind)) {
        t2.typed = false;
        break;
      }
    }
    return t2;
  } };
}(u(), function e2(t2, s2) {
  return { kind: "validation", type: "min_length", reference: e2, async: false, expects: `>=${t2}`, requirement: t2, message: s2, _run(e5, t3) {
    return e5.typed && e5.value.length < this.requirement && n$1(this, "length", e5, t3, { received: `${e5.value.length}` }), e5;
  } };
}(1)), c = i(p), l = r({ baseUrl: p, dataset: c, id: p, path: p, projectId: c, tool: c, type: c, workspace: c, isDraft: i(u()) });
function y(n2) {
  const { id: s2, path: r2, baseUrl: i2, tool: u2, workspace: a2, type: p2 } = n2;
  return c2 = n2, l._run({ typed: false, value: c2 }, { abortEarly: true }).issues ? void 0 : [["id", getPublishedId(s2)], ["type", p2], ["path", o(studioPath.fromString(r2))], ["base", encodeURIComponent(i2)], ["workspace", a2], ["tool", u2], ["isDraft", s2.startsWith("drafts.")]].filter(([, e5]) => !!e5).map((e5) => {
    const [t2, n3] = e5;
    return true === n3 ? t2 : e5.join("=");
  }).join(";");
  var c2;
}
r({ origin: p, href: p, data: i(/* @__PURE__ */ function e3(t2, r2, i2) {
  return { kind: "schema", type: "record", reference: e3, expects: "Object", async: false, key: t2, value: r2, message: i2, _run(e5, t3) {
    const r3 = e5.value;
    if (r3 && "object" == typeof r3) {
      e5.typed = true, e5.value = {};
      for (const n2 in r3) if (s(n2)) {
        const s2 = r3[n2], i3 = this.key._run({ typed: false, value: n2 }, t3);
        if (i3.issues) {
          const u3 = { type: "record", origin: "key", input: r3, key: n2, value: s2 };
          for (const t4 of i3.issues) t4.path = [u3], e5.issues?.push(t4);
          if (e5.issues || (e5.issues = i3.issues), t3.abortEarly) {
            e5.typed = false;
            break;
          }
        }
        const u2 = this.value._run({ typed: false, value: s2 }, t3);
        if (u2.issues) {
          const i4 = { type: "record", origin: "value", input: r3, key: n2, value: s2 };
          for (const t4 of u2.issues) t4.path ? t4.path.unshift(i4) : t4.path = [i4], e5.issues?.push(t4);
          if (e5.issues || (e5.issues = u2.issues), t3.abortEarly) {
            e5.typed = false;
            break;
          }
        }
        (!i3.typed || !u2.typed) && (e5.typed = false), i3.typed && (e5.value[i3.value] = u2.value);
      }
    } else n$1(this, "type", e5, t3);
    return e5;
  } };
}(u(), /* @__PURE__ */ function e4() {
  return { kind: "schema", type: "unknown", reference: e4, expects: "unknown", async: false, _run: (e5) => (e5.typed = true, e5) };
}())) });
const n = (n2, a2, i2, p2) => {
  if (!a2 || !i2) return;
  const c2 = studioPathToJsonPath(p2), u2 = resolveEditInfo({ resultPath: c2, resultSourceMap: a2, studioUrl: i2 });
  return u2 ? y({ baseUrl: u2.baseUrl, workspace: u2.workspace, tool: u2.tool, type: u2.type, id: u2.id, path: "string" == typeof u2.path ? u2.path : studioPath.toString(jsonPathToStudioPath(u2.path)) }) : void 0;
};
function a(t2, r2, s2, e5) {
  const i2 = (t3) => t3 ? "string" == typeof t3 ? studioPath.fromString(t3) : t3 : [], p2 = i2(e5);
  return Object.assign((t3) => n(0, r2, s2, [...p2, ...i2(t3)]), { scope: (o2) => a(t2, r2, s2, [...p2, ...i2(o2)]) });
}
function useEncodeDataAttribute(result, sourceMap, studioUrl) {
  return a(result, sourceMap, studioUrl);
}
function defineUseQuery({ createFetcherStore, studioUrlStore }) {
  const DEFAULT_PARAMS = {};
  const DEFAULT_OPTIONS = {};
  return (query, params = DEFAULT_PARAMS, options = DEFAULT_OPTIONS) => {
    if (typeof query === "object") {
      params = query.params || DEFAULT_PARAMS;
      options = query.options || DEFAULT_OPTIONS;
      query = query.query;
    }
    const initial = options.initial ? {
      perspective: "published",
      ...options.initial
    } : void 0;
    const $params = JSON.stringify(params);
    const $fetcher = createFetcherStore(query, JSON.parse($params), initial);
    const $writeable = writable($fetcher.value);
    return derived([$writeable, studioUrlStore], ([value, studioUrl]) => ({
      ...value,
      encodeDataAttribute: useEncodeDataAttribute(value.data, value.sourceMap, studioUrl)
    }));
  };
}
const createQueryStore = (options) => {
  const { createFetcherStore, setServerClient: setServerClient2, enableLiveMode, unstable__cache, unstable__serverClient: unstable__serverClient2 } = q({
    tag: "svelte-loader",
    ...options
  });
  const studioUrlStore = defineStudioUrlStore(options.client);
  const useQuery2 = defineUseQuery({ createFetcherStore, studioUrlStore });
  const useLiveMode2 = defineUseLiveMode({
    enableLiveMode,
    studioUrlStore
  });
  const loadQuery2 = async (query, params = {}, options2 = {}) => {
    const { headers, tag } = options2;
    const perspective = options2.perspective || unstable__serverClient2.instance?.config().perspective || "published";
    const stega = options2.stega ?? unstable__serverClient2.instance?.config().stega ?? false;
    if (typeof document !== "undefined") {
      throw new Error("Cannot use `loadQuery` in a browser environment, you should use it inside a load function.");
    }
    if (perspective !== "published" && !unstable__serverClient2.instance) {
      throw new Error(`You cannot use other perspectives than "published" unless call "setServerClient" first.`);
    }
    if (perspective === "previewDrafts") {
      if (!unstable__serverClient2.canPreviewDrafts) {
        throw new Error(`You cannot use "previewDrafts" unless you set a "token" in the "client" instance passed to "setServerClient".`);
      }
      const { result: result2, resultSourceMap: resultSourceMap2 } = await unstable__serverClient2.instance.fetch(query, params, {
        filterResponse: false,
        resultSourceMap: "withKeyArraySelector",
        perspective,
        useCdn: false,
        headers,
        tag,
        stega
      });
      return { data: result2, sourceMap: resultSourceMap2, perspective };
    }
    const useCdn = options2.useCdn || unstable__serverClient2.instance.config().useCdn;
    const { result, resultSourceMap } = await unstable__cache.instance.fetch(JSON.stringify({ query, params, perspective, useCdn, stega }));
    return resultSourceMap ? { data: result, sourceMap: resultSourceMap } : { data: result };
  };
  return {
    loadQuery: loadQuery2,
    // @ts-expect-error - update typings
    useQuery: useQuery2,
    setServerClient: setServerClient2,
    useLiveMode: useLiveMode2,
    unstable__serverClient: unstable__serverClient2
  };
};
const {
  /** @public */
  loadQuery,
  /** @public */
  setServerClient,
  /** @public */
  useLiveMode,
  /** @public */
  useQuery,
  /** @internal */
  unstable__serverClient
} = createQueryStore({
  client: false,
  ssr: true
});
export {
  U,
  unstable__serverClient as a,
  loadQuery as l,
  setServerClient as s,
  useQuery as u
};
