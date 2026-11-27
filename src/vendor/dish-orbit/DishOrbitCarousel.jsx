/**
 * Food Menu Scroll Carousel — Kedhareswer Naidu, MIT.
 * Adapted from the author's publicly published 21st.dev preview (2026-11-27).
 * The original layout, assets, GSAP orbit, arc morph and title timings are retained.
 * Integration changes are documented in README.md alongside this file.
 */
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import orbitFont from "./assets/dish-font.woff2";
import "./DishOrbitCarousel.css";

gsap.registerPlugin(ScrollTrigger);
const named = (callback) => callback;

function wrapIndex(p, l) {
  return l <= 0 ? 0 : ((Math.round(p) % l) + l) % l;
}
named(wrapIndex, "wrapIndex");
function stepDirection(p, l, u) {
  if (u <= 0) return 1;
  const a = (((l - p) % u) + u) % u;
  return a <= u - a ? 1 : -1;
}
named(stepDirection, "stepDirection");
function scrollSteps(p, l) {
  return Math.max(0, l ? p : p - 1);
}
named(scrollSteps, "scrollSteps");
function segmentFor(p, l, u, a) {
  return a && p === 0 && l > u / 2 ? u : p;
}
named(segmentFor, "segmentFor");
function stripStart(p, l, u) {
  return l <= u ? 0 : Math.max(0, Math.min(p - 1, l - u));
}
named(stripStart, "stripStart");
function fitSize(p, l, u, a) {
  return Math.min(l, u / (Math.max(1, p) * a));
}
named(fitSize, "fitSize");
function arcPath(p, l, u, a, r, o, h = 48) {
  const d = [],
    v = [];
  for (let g = 0; g <= h; g++) {
    const y = g / h,
      T = ((p + (l - p) * y) * Math.PI) / 180,
      S = (o / 2) * Math.pow(Math.sin(Math.PI * y), 0.45),
      x = Math.cos(T),
      z = Math.sin(T);
    (d.push((u + x * (r + S)).toFixed(1) + " " + (a + z * (r + S)).toFixed(1)),
      v.push(
        (u + x * (r - S)).toFixed(1) + " " + (a + z * (r - S)).toFixed(1),
      ));
  }
  return "M" + d.join("L") + "L" + v.reverse().join("L") + "Z";
}
named(arcPath, "arcPath");
const ARC_RESTS = [
  [50, 98],
  [46, 124],
  [60, 126],
  [40, 100],
];
function arcRest(p) {
  return ARC_RESTS[
    ((p % ARC_RESTS.length) + ARC_RESTS.length) % ARC_RESTS.length
  ];
}
named(arcRest, "arcRest");
const ARC_PEAK = [38, 146],
  ARC_CX = 299,
  ARC_CY = -450,
  ARC_RADIUS = 650,
  SCROLL_STEP = 0.7,
  ORBIT_TURN = 50,
  THUMB_STEP = 118,
  VISIBLE_THUMBS = 4,
  FONT_FAMILY = "dsh-face",
  WIPE_LEFT = "inset(0% 0% 0% 100%)",
  WIPE_RIGHT = "inset(0% 100% 0% 0%)",
  WIPE_CLEAR = "inset(0% 0% 0% 0%)",
  icons = {
    search: jsxRuntime.jsxs("svg", {
      className: "dsh-ico",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: [
        jsxRuntime.jsx("circle", { cx: "11", cy: "11", r: "6.5" }),
        jsxRuntime.jsx("path", { d: "m16 16 4 4" }),
      ],
    }),
    menu: jsxRuntime.jsx("svg", {
      className: "dsh-ico",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: jsxRuntime.jsx("path", { d: "M4 6.5h16M4 12h16M4 17.5h16" }),
    }),
    play: jsxRuntime.jsx("svg", {
      className: "dsh-ico dsh-fill",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: jsxRuntime.jsx("path", { d: "M6 3.5v17l14-8.5z" }),
    }),
    order: jsxRuntime.jsx("svg", {
      className: "dsh-ico dsh-fill",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: jsxRuntime.jsx("path", { d: "M12 5 3 15h18zM3 18h18v2.5H3z" }),
    }),
    up: jsxRuntime.jsx("svg", {
      className: "dsh-ico",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: jsxRuntime.jsx("path", {
        d: "M7 10v10H3.5V10zM7 10l4-7c1.6 0 2.6 1.2 2.2 2.8L12.6 9H19a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 20H7",
      }),
    }),
    down: jsxRuntime.jsx("svg", {
      className: "dsh-ico",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: jsxRuntime.jsx("path", {
        d: "M17 14V4h3.5v10zM17 14l-4 7c-1.6 0-2.6-1.2-2.2-2.8l.6-3.2H5a2 2 0 0 1-2-2.3l1.3-7A2 2 0 0 1 6.3 4H17",
      }),
    }),
  };
export default function DishOrbitCarousel({
  dishes: p,
  height: l = "100svh",
  backdrop: u,
  loop: a = !0,
  fontSrc: r = orbitFont,
  onPlay: o,
  onOrder: h,
  onChange: d,
  onSearch,
  onMenu,
  scrollDriven = true,
  className: v,
}) {
  const detailsId = React.useId();
  const g = p.length,
    [y, T] = React.useState(0),
    [S, x] = React.useState("overview"),
    [z, E] = React.useState({}),
    [D, j] = React.useState({}),
    Z = React.useRef(null),
    k = React.useRef(null),
    L = React.useRef(null),
    B = React.useRef(0),
    _ = React.useRef(0),
    X = React.useRef(d);
  X.current = d;
  const I = React.useRef([]),
    W = React.useRef([]),
    P = React.useRef([]),
    ht = React.useRef(null),
    $ = React.useRef({ a0: 0, a1: 0 }),
    Et = React.useRef(-1),
    vt = React.useRef(1),
    dt = React.useRef(null),
    C = React.useRef(!1),
    q = React.useRef(null);
  (React.useLayoutEffect(() => {
    const K = k.current;
    if (!K) return;
    const F = named(() => {
      const Mt = K.clientWidth,
        wt = K.clientHeight;
      K.style.setProperty("--dsh-s", String(Math.min(Mt / 960, wt / 520, 1.6)));
    }, "fit");
    F();
    const gt = new ResizeObserver(F);
    return (gt.observe(K), () => gt.disconnect());
  }, []),
    React.useEffect(() => {
      const K = window.matchMedia("(prefers-reduced-motion: reduce)"),
        F = named(() => {
          C.current = K.matches;
          if (K.matches && dt.current) {
            dt.current.progress(1).kill();
            dt.current = null;
          }
        }, "on");
      return (
        F(),
        K.addEventListener("change", F),
        () => K.removeEventListener("change", F)
      );
    }, []),
    React.useLayoutEffect(() => {
      const K = Et.current,
        F = y,
        gt = named((N) => {
          const ue = W.current[N];
          return {
            orbit: I.current[N],
            head: ue,
            eye: ue && ue.querySelector(".dsh-eye"),
            t1: ue && ue.querySelector(".dsh-t1"),
            t2: ue && ue.querySelector(".dsh-t2"),
            body: P.current[N],
          };
        }, "parts"),
        Mt = named(() => {
          var N;
          return (N = ht.current) == null
            ? void 0
            : N.setAttribute(
                "d",
                arcPath(
                  $.current.a0,
                  $.current.a1,
                  ARC_CX,
                  ARC_CY,
                  ARC_RADIUS,
                  118,
                ),
              );
        }, "drawArc"),
        wt = arcRest(F),
        Vt = p[F] ? p[F].accent : "transparent";
      dt.current && dt.current.progress(1).kill();
      const mt = gt(F);
      if (K === -1 || K === F || C.current) {
        for (let N = 0; N < g; N++)
          if (N !== F) {
            const ue = gt(N);
            gsap.set([ue.orbit, ue.head, ue.body], { autoAlpha: 0 });
          }
        (gsap.set([mt.orbit, mt.head, mt.body, mt.eye], {
          autoAlpha: 1,
          rotation: 0,
          y: 0,
        }),
          gsap.set(mt.t1, { clipPath: WIPE_CLEAR }),
          gsap.set(mt.t2, { clipPath: WIPE_CLEAR }),
          ($.current.a0 = wt[0]),
          ($.current.a1 = wt[1]),
          Mt(),
          ht.current && gsap.set(ht.current, { fill: Vt }),
          (Et.current = F));
        return;
      }
      const Qt = gt(K),
        qe = vt.current,
        ve = gsap.timeline({
          onComplete: named(() => {
            dt.current = null;
          }, "onComplete"),
        });
      ((dt.current = ve),
        ve
          .to(
            Qt.orbit,
            { rotation: ORBIT_TURN * qe, duration: 0.62, ease: "power2.in" },
            0,
          )
          .set(Qt.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
          .fromTo(
            mt.orbit,
            { autoAlpha: 1, rotation: -ORBIT_TURN * qe },
            { rotation: 0, duration: 0.95, ease: "power3.out" },
            0.3,
          ),
        ve
          .to(
            Qt.t1,
            { clipPath: WIPE_LEFT, duration: 0.42, ease: "power2.in" },
            0,
          )
          .to(
            Qt.t2,
            { clipPath: WIPE_RIGHT, duration: 0.42, ease: "power2.in" },
            0.06,
          )
          .to(Qt.eye, { autoAlpha: 0, duration: 0.25 }, 0)
          .set(Qt.head, { autoAlpha: 0 }, 0.5)
          .set(mt.head, { autoAlpha: 1 }, 0.5)
          .fromTo(
            mt.eye,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
            0.55,
          )
          .fromTo(
            mt.t1,
            { clipPath: WIPE_LEFT },
            { clipPath: WIPE_CLEAR, duration: 0.7, ease: "power3.out" },
            0.55,
          )
          .fromTo(
            mt.t2,
            { clipPath: WIPE_RIGHT },
            { clipPath: WIPE_CLEAR, duration: 0.7, ease: "power3.out" },
            0.62,
          ),
        ve
          .to(
            Qt.body,
            { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" },
            0.05,
          )
          .set(mt.body, { autoAlpha: 1, y: 0 }, 0.4),
        mt.body &&
          ve.fromTo(
            mt.body.children,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: "power2.out",
            },
            0.4,
          ),
        ve
          .to(
            $.current,
            {
              a0: ARC_PEAK[0],
              a1: ARC_PEAK[1],
              duration: 0.6,
              ease: "power2.inOut",
              onUpdate: Mt,
            },
            0,
          )
          .to(
            $.current,
            {
              a0: wt[0],
              a1: wt[1],
              duration: 0.85,
              ease: "power3.out",
              onUpdate: Mt,
            },
            0.6,
          ),
        ht.current &&
          ve.to(
            ht.current,
            { fill: Vt, duration: 1.1, ease: "power1.inOut" },
            0.1,
          ),
        (Et.current = F));
    }, [y, g, p]),
    React.useEffect(
      () => () => {
        var K;
        (K = dt.current) == null || K.kill();
      },
      [],
    ));
  const et = named((K, F) => {
      var gt;
      K !== _.current &&
        ((vt.current = F),
        (_.current = K),
        T(K),
        (gt = X.current) == null || gt.call(X, K));
    }, "select"),
    ct = scrollDriven ? scrollSteps(g, a) : 0;
  React.useEffect(() => {
    const K = Z.current;
    if (!K || ct < 1) return;
    const F = ScrollTrigger.create({
      trigger: K,
      start: "top top+=" + (parseFloat(getComputedStyle(k.current).top) || 0),
      end: "bottom bottom",
      onUpdate: named((wt) => {
        if (a && wt.progress >= 1 && wt.direction > 0) {
          ((B.current = 0), wt.scroll(wt.start + 1), et(0, 1));
          return;
        }
        const Vt = Math.round(wt.progress * ct);
        if (Vt === B.current) return;
        const mt = Vt > B.current ? 1 : -1;
        ((B.current = Vt), et(wrapIndex(Vt, g), mt));
      }, "onUpdate"),
    });
    let gt = 0;
    const Mt = named((wt) => {
      const Vt = F.scroll();
      !a ||
        wt.deltaY >= 0 ||
        Vt < F.start - 1 ||
        Vt > F.start + 1 ||
        (cancelAnimationFrame(gt),
        (gt = requestAnimationFrame(() => {
          ((B.current = g - 1),
            F.scroll(F.start + ((F.end - F.start) * (g - 1)) / ct),
            et(g - 1, -1));
        })));
    }, "onWheel");
    return (
      window.addEventListener("wheel", Mt, { passive: !0 }),
      (L.current = F),
      () => {
        (cancelAnimationFrame(gt),
          window.removeEventListener("wheel", Mt),
          F.kill(),
          (L.current = null));
      }
    );
  }, [ct, a, g]);
  const b = named((K, F) => {
      if (g < 2) return;
      const gt = wrapIndex(K, g);
      if (gt === y) return;
      const Mt = L.current,
        wt = Mt ? Mt.scroll() : 0;
      if (Mt && wt >= Mt.start - 1 && wt <= Mt.end + 1) {
        const Vt = segmentFor(gt, B.current, g, a);
        ((B.current = Vt),
          Mt.scroll(Mt.start + ((Mt.end - Mt.start) * Vt) / ct));
      }
      et(gt, F ?? stepDirection(y, gt, g));
    }, "go"),
    G = named((K) => b(y + K, K), "step"),
    lt = named((K) => {
      K.key === "ArrowRight"
        ? (K.preventDefault(), G(1))
        : K.key === "ArrowLeft" && (K.preventDefault(), G(-1));
    }, "onKeyDown"),
    nt = named((K) => {
      q.current = { x: K.clientX, y: K.clientY };
    }, "onPointerDown"),
    at = named((K) => {
      const F = q.current;
      if (((q.current = null), !F)) return;
      const gt = K.clientX - F.x;
      Math.abs(gt) > 40 &&
        Math.abs(gt) > Math.abs(K.clientY - F.y) * 1.4 &&
        G(gt < 0 ? 1 : -1);
    }, "onPointerUp"),
    yt = stripStart(y, g, VISIBLE_THUMBS),
    ut = p[y];
  const onDetailsKeyDown = (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft")
      next = S === "overview" ? "ingredients" : "overview";
    if (event.key === "Home") next = "overview";
    if (event.key === "End") next = "ingredients";
    if (!next) return;
    event.preventDefault();
    event.stopPropagation();
    x(next);
    event.currentTarget.querySelector(`[data-detail-tab="${next}"]`)?.focus();
  };
  return jsxRuntime.jsx("div", {
    ref: Z,
    className: "dsh-trk" + (v ? " " + v : ""),
    style: {
      height: scrollDriven
        ? "calc(" + l + " * " + (1 + ct * SCROLL_STEP) + ")"
        : l,
    },
    children: jsxRuntime.jsxs("div", {
      ref: k,
      className: "dsh-root",
      style: { height: l },
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": "Примеры блюд",
      tabIndex: 0,
      onKeyDown: lt,
      children: [
        jsxRuntime.jsx("style", {
          children: r
            ? "@font-face{font-family:" +
              FONT_FAMILY +
              ";src:url(" +
              r +
              ") format('woff2');font-weight:100 900;font-display:swap}"
            : "",
        }),
        u
          ? jsxRuntime.jsx("img", {
              className: "dsh-bd",
              src: u,
              alt: "",
              width: 1200,
              height: 900,
            })
          : null,
        u ? jsxRuntime.jsx("div", { className: "dsh-dim" }) : null,
        u ? jsxRuntime.jsx("div", { className: "dsh-wash" }) : null,
        jsxRuntime.jsxs("div", {
          className: "dsh-canvas",
          children: [
            jsxRuntime.jsx("svg", {
              className: "dsh-arc",
              viewBox: "0 0 960 520",
              "aria-hidden": "true",
              children: jsxRuntime.jsx("path", {
                ref: ht,
                style: { opacity: 0.34 },
              }),
            }),
            jsxRuntime.jsxs("div", {
              className: "dsh-top",
              children: [
                jsxRuntime.jsx("button", {
                  type: "button",
                  className: "dsh-btn",
                  "aria-label": "Показать меню недели",
                  onClick: onSearch,
                  children: icons.search,
                }),
                jsxRuntime.jsx("button", {
                  type: "button",
                  className: "dsh-btn",
                  "aria-label": "Выбрать программу",
                  onClick: onMenu,
                  children: icons.menu,
                }),
              ],
            }),
            jsxRuntime.jsx("div", {
              className: "dsh-pager",
              role: "tablist",
              "aria-label": "Выбрать блюдо",
              children: p.map((K, F) =>
                jsxRuntime.jsx(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    className: "dsh-btn dsh-dot",
                    "aria-selected": F === y,
                    "aria-current": F === y ? "true" : void 0,
                    "aria-label": K.title + " " + K.subtitle,
                    onClick: named(() => b(F), "onClick"),
                    children: jsxRuntime.jsx("i", {}),
                  },
                  F,
                ),
              ),
            }),
            jsxRuntime.jsx("div", {
              className: "dsh-plates",
              onPointerDown: nt,
              onPointerUp: at,
              onPointerCancel: named(
                () => (q.current = null),
                "onPointerCancel",
              ),
              children: p.map((K, F) =>
                jsxRuntime.jsx(
                  "div",
                  {
                    ref: named((gt) => {
                      I.current[F] = gt;
                    }, "ref"),
                    className: "dsh-orbit",
                    "aria-hidden": F !== y,
                    children: jsxRuntime.jsx("img", {
                      src: K.image,
                      alt: K.alt ?? K.title + " " + K.subtitle,
                      width: 245,
                      height: 245,
                      draggable: !1,
                    }),
                  },
                  F,
                ),
              ),
            }),
            jsxRuntime.jsx("div", {
              className: "dsh-head",
              children: p.map((K, F) =>
                jsxRuntime.jsxs(
                  "div",
                  {
                    ref: named((gt) => {
                      W.current[F] = gt;
                    }, "ref"),
                    className: "dsh-hd",
                    "aria-hidden": F !== y,
                    children: [
                      jsxRuntime.jsx("p", {
                        className: "dsh-eye",
                        children:
                          K.eyebrow ?? "#" + (F + 1) + " Most loved dish",
                      }),
                      jsxRuntime.jsxs("h2", {
                        style: { margin: 0, font: "inherit" },
                        children: [
                          jsxRuntime.jsx("span", {
                            className: "dsh-t1",
                            style: {
                              fontSize:
                                fitSize(K.title.length, 56, 330, 0.56) + "px",
                            },
                            children: K.title,
                          }),
                          jsxRuntime.jsx("span", {
                            className: "dsh-t2",
                            style: {
                              fontSize:
                                fitSize(K.subtitle.length, 62, 320, 0.64) +
                                "px",
                            },
                            children: K.subtitle,
                          }),
                        ],
                      }),
                    ],
                  },
                  F,
                ),
              ),
            }),
            jsxRuntime.jsxs("div", {
              className: "dsh-acts",
              children: [
                jsxRuntime.jsxs("button", {
                  type: "button",
                  className: "dsh-btn",
                  onClick: named(
                    () => ut && (o == null ? void 0 : o(ut, y)),
                    "onClick",
                  ),
                  children: [icons.play, "Меню недели"],
                }),
                jsxRuntime.jsxs("button", {
                  type: "button",
                  className: "dsh-btn",
                  onClick: named(
                    () => ut && (h == null ? void 0 : h(ut, y)),
                    "onClick",
                  ),
                  children: [icons.order, "Выбрать рацион"],
                }),
              ],
            }),
            jsxRuntime.jsxs("div", {
              className: "dsh-card",
              children: [
                jsxRuntime.jsx("div", {
                  className: "dsh-tabs",
                  role: "tablist",
                  "aria-label": "Описание блюда",
                  onKeyDown: onDetailsKeyDown,
                  children: ["overview", "ingredients"].map((K) =>
                    jsxRuntime.jsx(
                      "button",
                      {
                        type: "button",
                        role: "tab",
                        id: detailsId + "-" + K,
                        "data-detail-tab": K,
                        "aria-controls": detailsId + "-panel",
                        tabIndex: S === K ? 0 : -1,
                        className: "dsh-btn dsh-tab",
                        "aria-selected": S === K,
                        onClick: named(() => x(K), "onClick"),
                        children: K === "overview" ? "Описание" : "Состав",
                      },
                      K,
                    ),
                  ),
                }),
                jsxRuntime.jsx("div", {
                  className: "dsh-bodies",
                  id: detailsId + "-panel",
                  role: "tabpanel",
                  "aria-labelledby": detailsId + "-" + S,
                  children: p.map((K, F) => {
                    var gt;
                    return jsxRuntime.jsxs(
                      "div",
                      {
                        ref: named((Mt) => {
                          P.current[F] = Mt;
                        }, "ref"),
                        className: "dsh-body",
                        "aria-hidden": F !== y,
                        children: [
                          jsxRuntime.jsxs("div", {
                            className: "dsh-rate",
                            children: [
                              jsxRuntime.jsx("div", {
                                className: "dsh-badge",
                                style: { background: K.accent },
                                children: jsxRuntime.jsx("svg", {
                                  viewBox: "0 0 24 24",
                                  "aria-hidden": "true",
                                  children: jsxRuntime.jsx("path", {
                                    d: "m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z",
                                  }),
                                }),
                              }),
                              jsxRuntime.jsx("span", {
                                className: "dsh-num",
                                "aria-label":
                                  "Rated " + K.rating.toFixed(1) + " out of 5",
                                children: K.rating.toFixed(1),
                              }),
                            ],
                          }),
                          jsxRuntime.jsx("p", {
                            className: "dsh-chef",
                            children: K.chef,
                          }),
                          jsxRuntime.jsx("p", {
                            className: "dsh-kit",
                            children: K.kitchen ?? " ",
                          }),
                          S === "overview" ||
                          !((gt = K.ingredients) != null && gt.length)
                            ? jsxRuntime.jsx("p", {
                                className: "dsh-desc",
                                children: K.description,
                              })
                            : jsxRuntime.jsx("ul", {
                                className: "dsh-ing",
                                children: K.ingredients.map((Mt) =>
                                  jsxRuntime.jsx("li", { children: Mt }, Mt),
                                ),
                              }),
                          jsxRuntime.jsxs("div", {
                            className: "dsh-react",
                            children: [
                              jsxRuntime.jsxs("button", {
                                type: "button",
                                className: "dsh-btn dsh-like",
                                "aria-pressed": !!z[F],
                                tabIndex: F === y ? 0 : -1,
                                onClick: named(() => {
                                  (E((Mt) => ({ ...Mt, [F]: !Mt[F] })),
                                    j((Mt) => ({ ...Mt, [F]: !1 })));
                                }, "onClick"),
                                children: [
                                  icons.up,
                                  K.likes + (z[F] ? 1 : 0),
                                  " likes",
                                ],
                              }),
                              jsxRuntime.jsx("button", {
                                type: "button",
                                className: "dsh-btn dsh-meh",
                                "aria-pressed": !!D[F],
                                "aria-label": "Не нравится",
                                tabIndex: F === y ? 0 : -1,
                                onClick: named(() => {
                                  (j((Mt) => ({ ...Mt, [F]: !Mt[F] })),
                                    E((Mt) => ({ ...Mt, [F]: !1 })));
                                }, "onClick"),
                                children: icons.down,
                              }),
                            ],
                          }),
                        ],
                      },
                      F,
                    );
                  }),
                }),
              ],
            }),
            jsxRuntime.jsxs("div", {
              className: "dsh-strip",
              children: [
                jsxRuntime.jsx("button", {
                  type: "button",
                  className: "dsh-btn dsh-arrow",
                  "aria-label": "Предыдущее блюдо",
                  onClick: named(() => G(-1), "onClick"),
                  children: jsxRuntime.jsx("svg", {
                    viewBox: "0 0 12 16",
                    "aria-hidden": "true",
                    children: jsxRuntime.jsx("path", { d: "M11 0v16L0 8z" }),
                  }),
                }),
                jsxRuntime.jsx("div", {
                  className: "dsh-win",
                  children: jsxRuntime.jsx("div", {
                    className: "dsh-track",
                    style: {
                      transform: "translateX(" + -yt * THUMB_STEP + "px)",
                    },
                    children: p.map((K, F) =>
                      jsxRuntime.jsx(
                        "div",
                        {
                          className: "dsh-th",
                          children: jsxRuntime.jsxs("button", {
                            type: "button",
                            className: "dsh-btn",
                            "aria-current": F === y ? "true" : void 0,
                            onClick: named(() => b(F), "onClick"),
                            children: [
                              jsxRuntime.jsx("img", {
                                src: K.image,
                                alt: "",
                                width: 56,
                                height: 56,
                                draggable: !1,
                              }),
                              jsxRuntime.jsx("span", {
                                children: K.label ?? K.title + " " + K.subtitle,
                              }),
                            ],
                          }),
                        },
                        F,
                      ),
                    ),
                  }),
                }),
                jsxRuntime.jsx("button", {
                  type: "button",
                  className: "dsh-btn dsh-arrow",
                  "aria-label": "Следующее блюдо",
                  onClick: named(() => G(1), "onClick"),
                  children: jsxRuntime.jsx("svg", {
                    viewBox: "0 0 12 16",
                    "aria-hidden": "true",
                    children: jsxRuntime.jsx("path", { d: "M1 0v16l11-8z" }),
                  }),
                }),
              ],
            }),
          ],
        }),
        jsxRuntime.jsx("p", {
          className: "dsh-sr",
          "aria-live": "polite",
          children: ut
            ? "Блюдо " +
              (y + 1) +
              " из " +
              g +
              ": " +
              ut.title +
              " " +
              ut.subtitle
            : "",
        }),
      ],
    }),
  });
}
named(DishOrbitCarousel, "DishOrbitCarousel");
