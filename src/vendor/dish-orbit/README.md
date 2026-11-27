# Food Menu Scroll Carousel

Original author: **Kedhareswer Naidu**. License: **MIT**.

- Reference: https://21st.dev/@kedhareswer/components/dish-orbit-carousel
- Original published preview URL and SHA-256 are recorded in `provenance.json`.
- The source is adapted from the author's public, self-contained preview bundle. This is not a claim that the API-key-protected TSX download was retrieved.
- Original plate cutouts, room backdrop, font, composition, orbit pivot, GSAP timings, title wipes, arc geometry, thumbnail rail, detail tabs and reactions are retained.
- Original illustrative dish data, fictional chefs and example ratings are retained as clearly marked demo content, not Health Food reviews or actual staff.

Integration changes:

- Compiled React calls were retained, while top-level helper identifiers were restored to meaningful names. The component is isolated from the rest of the static page.
- Controls are labelled in Russian and connected to the site's programs and weekly menu.
- Scrolling is finite, so the visitor can continue to later sections. Page-wide snapping is disabled. The original visual orbit transition is retained.
- The sticky section accounts for the site's header. Compact viewports use the original stacked layout and explicit dish controls instead of a pinned scroll section.
- Reduced motion disables scroll-driven transitions and completes an already running transition. Native keyboard and swipe controls remain available.
- Preview-shell code, theme controls, bundled React/GSAP copies and analytics are not included. Installed React, React DOM and GSAP are bundled once by esbuild.
- Original external data URLs have been extracted into local assets.
