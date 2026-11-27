# Section backgrounds and gentle waves

28 November 2026

Homepage sections and the three program pages now alternate white, the existing neutral background and pale tints of the existing lime color. Full-width SVG masks form shallow waves at section boundaries, including the transition into the dark footer. Responsive spacing reserves room for the waves above the previous section's content.

Only the decorative boundary changes with scroll. CSS view timelines adjust its vertical scale from 0.9 to 1.1, keeping its base attached to the next section. There are no new JavaScript scroll listeners, timers or dependencies. Cards remain static. Unsupported browsers and reduced-motion preferences use the static wave.

## Verification

- Chrome Modern Web Guidance `parallax-scroll-effects`: feature detection includes both `animation-timeline` and `animation-range`; animation declarations precede the timeline/range; motion is enabled only under `prefers-reduced-motion: no-preference`.
- Native browser check at 1280 × 900: the team boundary changed from `matrix(1, 0, 0, 1.01612, 0, 0)` to `matrix(1, 0, 0, 1.08119, 0, 0)` after a 200 px scroll. This confirms scroll coupling, not a performance benchmark.
- Checked homepage transitions and footer at 1280 px and 390 px, and program content/menu at 1280 px and 320 px. No horizontal page overflow in those views; the menu's horizontal tab scrolling is intentional.
- Review/team cards remain visible without transforms. The program total for twenty days remains 222 000 KZT; the desktop price card remains sticky.
- Reserved extra space below the program hero after detecting that the wave box extended into its content area. The final clearance is 26 px at 1280 px and 24 px at 320 px; homepage boundaries also have positive clearance.
- Built all four routes, verified internal links/assets and JavaScript, and passed `npm run check` and all six existing motion lifecycle tests. Browser console checks contained no errors.
- Screenshots saved outside the repository in `research/wave-surfaces/`.

Browser media emulation is unavailable in the current tool. Static fallback and reduced-motion CSS were reviewed in source; no runtime preference-emulation check is claimed.
