import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

// Exercise the motion lifecycle without relying on browser-specific frame timing.
function fixture({ reduced = false, animationFails = false, reviews = false } = {}) {
  const listeners = new Map();
  const animations = [];
  let preferenceChanged;
  let intersection;
  let disconnected = 0;
  const observed = new Set();

  class Element {
    children = [];
    parentElement = null;
    classList = new Set();
    constructor() {
      this.classList.remove = this.classList.delete;
    }
    closest(selector) { return reviews && selector === "#reviews" ? this : null; }
    setAttribute() {}
    append(child) { this.children.push(child); }
    contains(target) { return target === this; }
    animate() {
      if (animationFails) throw new Error("Animation unavailable");
      const calls = [];
      const animation = {
        calls,
        cancel: () => calls.push("cancel"),
        finish: () => calls.push("finish"),
        reverse: () => calls.push("reverse"),
        play: () => calls.push("play"),
        updatePlaybackRate: rate => calls.push(rate),
      };
      animations.push(animation);
      return animation;
    }
  }
  const heading = new Element();
  const copy = new Element();
  const preference = {
    matches: reduced,
    addEventListener: (_, callback) => { preferenceChanged = callback; },
  };
  class IntersectionObserver {
    constructor(callback) { intersection = callback; }
    observe(target) { observed.add(target); }
    unobserve(target) { observed.delete(target); }
    disconnect() { disconnected++; }
  }
  const document = {
    activeElement: null,
    querySelectorAll: selector => selector.startsWith("main h1") ? [heading] :
      reviews && selector.startsWith(".hf-hero-copy") ? [copy] : [],
    createElement: () => new Element(),
    addEventListener: (type, callback) => listeners.set(type, callback),
  };
  vm.runInNewContext(source, {
    window: { IntersectionObserver, matchMedia: () => preference },
    IntersectionObserver, Element, document, CSS: { supports: () => true },
  });
  return {
    heading, copy, animations, observed,
    pending: () => heading.classList.has("hf-motion-pending"),
    intersect: visible => intersection([{ target: heading, isIntersecting: visible }]),
    focus: () => listeners.get("focusin")({ target: heading }),
    reduce() { preference.matches = true; preferenceChanged(); },
    disconnected: () => disconnected,
  };
}

test("reduced motion starts with visible content and no animated effects", () => {
  const page = fixture({ reduced: true });
  assert.equal(page.pending(), false);
  assert.equal(page.animations.length, 0);
  page.focus();
  assert.equal(page.animations.length, 0);
});

test("changing to reduced motion cancels active effects and reveals pending content", () => {
  const page = fixture();
  assert.equal(page.pending(), true);
  page.intersect(true);
  assert.equal(page.pending(), false);
  assert.equal(page.animations.length, 2);
  page.intersect(false);
  assert.ok(page.animations.every(animation => !animation.calls.includes("reverse")));
  page.reduce();
  assert.equal(page.disconnected(), 1);
  assert.equal(page.pending(), false);
  assert.ok(page.animations.every(animation => animation.calls.includes("cancel")));
});

test("keyboard focus finishes entry so a pending target is visible immediately", () => {
  const page = fixture();
  page.focus();
  assert.equal(page.pending(), false);
  assert.ok(page.animations.length > 0);
  assert.ok(page.animations.every(animation => animation.calls.includes("finish")));
});

test("returning to a section leaves it visible without repeating its effects", () => {
  const page = fixture();
  assert.ok(page.observed.has(page.heading));
  page.intersect(true);
  assert.equal(page.observed.has(page.heading), false);
  page.intersect(false);
  page.intersect(true);
  assert.equal(page.animations.length, 2);
  assert.equal(page.pending(), false);
  assert.ok(page.animations.every(animation => animation.calls.length === 0));
});

test("reviews remain visible and static without entering the motion lifecycle", () => {
  const page = fixture({ reviews: true });
  assert.equal(page.pending(), false);
  assert.equal(page.copy.classList.has("hf-motion-pending"), false);
  assert.equal(page.observed.size, 0);
  page.focus();
  assert.equal(page.animations.length, 0);
});

test("an unavailable animation leaves content visible", () => {
  const page = fixture({ animationFails: true });
  page.intersect(true);
  assert.equal(page.pending(), false);
});
