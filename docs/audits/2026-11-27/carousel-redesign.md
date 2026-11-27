# Carousel-led redesign

27 November 2026

The homepage and three program pages follow the visual direction of the existing Kedhareswer Naidu carousel. A generated design board was prepared before implementation. Local working images are saved in the adjacent research/slider-redesign directory.

The implementation uses the original carousel font, Outfit, with locally hosted Manrope for Cyrillic. Circular meal cutouts are illustrative assets from the same MIT-licensed component. Names, roles, contact details and program prices come from the existing site data.

## Interaction findings and verification

| Check | Observed result |
| --- | --- |
| Original desktop next-button click | Page scroll changed from 1782 to 2243 px |
| Updated direct mouse clicks, including a rapid sequence | Page scroll stayed at 1726 px |
| Carousel footprint on desktop | 660 px, with ordinary page scrolling and explicit dish controls |
| Description and ingredients at 390 px viewport | Both views measured 842 px high |
| Keyboard navigation | ArrowRight selected the second dish |
| Weekly menu action | Opened the weekly menu and rendered four meal cards |
| Program selection | Twenty days of the balance program carried through to the detailed page and draft form at 222 000 KZT |
| Responsive layout | No page overflow at 320, 390, 768 and 1280 px. Long card titles and twenty-day amounts fit their containers |
| Routes | Homepage and all three detailed program pages opened successfully |
| Build | Generated four pages, checked internal files and fragments, bundled the carousel and validated JavaScript |

The layout review follows Chrome Modern Web Guidance for stable content geometry. These are component measurements and interaction checks. A Core Web Vitals benchmark and reduced-motion emulation were not run. Reduced-motion handling was reviewed in source code.

Desktop captures from the available browser tool show compression softness. Mobile captures and the live browser were used to assess typography and alignment.
