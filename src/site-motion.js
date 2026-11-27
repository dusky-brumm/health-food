(() => {
  "use strict";

  if (!("IntersectionObserver" in window) ||
      !Element.prototype.animate ||
      !CSS.supports("clip-path", "inset(0)")) return;

  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const records = new Map();
  const transient = new Map();
  const ease = "cubic-bezier(.22, 1, .36, 1)";
  let observer;

  const effect = (element, frames, duration, delay = 0, name = "reveal") => ({
    element, frames, duration, delay, name,
  });

  function register(target, effects) {
    records.set(target, { target, effects, animations: [], entered: false });
  }

  function bandEffect(band, heading = false) {
    const angle = heading ? -8 : -26;
    const opacity = heading ? .2 : .65;
    return effect(band, [
      { opacity: 0, transform: "translateX(-32px) rotate(-38deg) scale(.06, .25)" },
      { opacity, transform: "translateX(8px) rotate(-16deg) scale(1.08, 1.4)", offset: .5 },
      { opacity, transform: "translateX(0) rotate(" + angle + "deg) scale(1, 1)" },
    ], 1450, 0, "band");
  }

  document.querySelectorAll("main h1, main h2, .hf-menu-heading h3").forEach(heading => {
    if (heading.closest(".dish-orbit-host, .hf-detail-price")) return;
    heading.classList.add("hf-motion-title");
    const lines = [...heading.children].filter(line => line.matches("span, strong, em"));
    const effects = (lines.length ? lines : [heading]).map((line, index) => effect(line, [
      {
        opacity: 0,
        clipPath: index % 2 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
        transform: "translateY(8px)",
      },
      { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
    ], index % 2 ? 900 : 780, index * 100, "title-wipe"));
    if (!heading.closest(".hf-hero, .hf-trial, .hf-detail-hero")) {
      const band = document.createElement("i");
      band.className = "hf-heading-band";
      band.setAttribute("aria-hidden", "true");
      heading.append(band);
      effects.push(bandEffect(band, true));
    }
    register(heading, effects);
  });

  document.querySelectorAll(".hf-plate-scene").forEach(scene => {
    const band = document.createElement("i");
    band.className = "hf-orbit-band";
    band.setAttribute("aria-hidden", "true");
    scene.prepend(band);
    scene.classList.add("hf-motion-scene");
    const photo = scene.querySelector("img");
    const effects = [bandEffect(band)];
    if (photo) {
      effects.push(effect(photo, [
        { opacity: 0, transform: "rotate(-30deg) scale(.94)" },
        { opacity: 1, transform: "rotate(0) scale(1)" },
      ], 1150, 100, "plate-orbit"));
    }
    register(scene, effects);
  });

  const cards = document.querySelectorAll(
    ".hf-price-card, .hf-review, .hf-team-card, .hf-article, " +
    ".hf-offer-inner, .hf-about-grid, .hf-kitchen-grid, .hf-contact-grid, " +
    ".hf-seo-grid, .hf-detail-price, .hf-other-grid > a, .hf-faq-grid details, .hf-hero-facts"
  );
  cards.forEach(card => {
    const siblings = [...card.parentElement.children];
    const delay = Math.min(siblings.indexOf(card), 5) * 70;
    const effects = [effect(card, [
      { opacity: 0, transform: "translateY(24px) scale(.97)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ], 760, delay, "card")];
    const photo = card.querySelector(".hf-plan-plate, .hf-review-photo img, .hf-team-card > img, .hf-article > img, .hf-video-poster img");
    if (photo) {
      effects.push(effect(photo, [
        { opacity: 0, clipPath: "inset(0 0 100% 0 round 20px)", transform: "rotate(-5deg) scale(.96)" },
        { opacity: 1, clipPath: "inset(0 0 0 0 round 20px)", transform: "rotate(0) scale(1)" },
      ], 1000, delay + 100, "photo"));
    }
    const title = card.querySelector("h3");
    if (title) {
      effects.push(effect(title, [
        { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        { opacity: 1, clipPath: "inset(0 0 0 0)" },
      ], 780, delay + 180, "card-title"));
    }
    register(card, effects);
  });

  document.querySelectorAll(
    ".hf-hero-copy > p, .hf-heading > p, .hf-trial p, " +
    ".hf-about p, .hf-kitchen-grid > div > p, .hf-seo p, .hf-contact-grid > div > p, " +
    ".hf-detail-summary > p, .hf-detail-content > .container > div > p, .hf-footer-top > *"
  ).forEach(copy => register(copy, [effect(copy, [
    { opacity: 0, transform: "translateY(14px)" },
    { opacity: 1, transform: "translateY(0)" },
  ], 700, 100, "copy")]));

  function start(record) {
    record.target.classList.remove("hf-motion-pending");
    if (!record.animations.length) {
      try {
        for (const item of record.effects) {
          const animation = item.element.animate(item.frames, {
            duration: item.duration,
            delay: item.delay,
            easing: ease,
            fill: "both",
          });
          animation.id = "hf-" + item.name;
          record.animations.push(animation);
        }
      } catch {
        record.animations.forEach(animation => animation.cancel());
        record.animations = [];
      }
    } else {
      record.animations.forEach(animation => {
        animation.updatePlaybackRate(1);
        animation.play();
      });
    }
    record.entered = true;
  }

  function stop() {
    observer?.disconnect();
    transient.forEach(animation => animation.cancel());
    transient.clear();
    for (const record of records.values()) {
      record.target.classList.remove("hf-motion-pending");
      record.animations.forEach(animation => animation.cancel());
      record.animations = [];
      record.entered = false;
    }
  }

  function syncPreference() {
    stop();
    if (preference.matches) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const record = records.get(entry.target);
        if (entry.isIntersecting) {
          start(record);
          if (record.target.contains(document.activeElement)) {
            record.animations.forEach(animation => animation.finish());
          }
        } else if (record.entered && !record.target.contains(document.activeElement)) {
          record.animations.forEach(animation => animation.reverse());
        }
      }
    }, { rootMargin: "-88px 0px -4%", threshold: .12 });
    for (const record of records.values()) {
      record.target.classList.add("hf-motion-pending");
      observer.observe(record.target);
    }
  }

  document.addEventListener("focusin", event => {
    if (preference.matches) return;
    let target = event.target;
    while (target instanceof Element) {
      const record = records.get(target);
      if (record) {
        start(record);
        record.animations.forEach(animation => animation.finish());
      }
      target = target.parentElement;
    }
  });

  function animateChange(element, index = 0) {
    transient.get(element)?.cancel();
    const animation = element.animate([
      { opacity: 0, clipPath: "inset(0 0 100% 0)", transform: "translateY(12px)" },
      { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
    ], { duration: 550, delay: index * 60, easing: ease });
    animation.id = "hf-value-change";
    transient.set(element, animation);
    const clear = () => {
      if (transient.get(element) === animation) transient.delete(element);
    };
    animation.finished.then(clear, clear);
  }

  document.addEventListener("click", event => {
    if (preference.matches || !(event.target instanceof Element)) return;
    if (event.target.closest("[data-duration]")) {
      document.querySelectorAll("[data-plan-total], #plan-price, #plan-total").forEach((element, index) => {
        animateChange(element, index);
      });
    }
    if (event.target.closest("[data-day]")) {
      document.querySelectorAll("#day-menu .meal-card").forEach(animateChange);
    }
  });

  document.addEventListener("toggle", event => {
    if (preference.matches || !event.target.matches?.("#weekly-menu[open]")) return;
    document.querySelectorAll("#day-menu .meal-card").forEach(animateChange);
  }, true);

  preference.addEventListener("change", syncPreference);
  syncPreference();
})();
