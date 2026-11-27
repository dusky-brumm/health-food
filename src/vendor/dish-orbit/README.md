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
- The carousel uses buttons, thumbnails, keyboard arrows and horizontal swipes. It occupies one section and does not drive or pin page scrolling. The original visual orbit transition is retained. Rapid selections wait for the current transition and keep the most recent requested dish.
- Compact viewports use the original stacked layout. Desktop and mobile both use explicit dish controls.
- Reduced motion completes an ongoing transition, applies the latest requested dish and disables orbital motion. Native keyboard and swipe controls remain available.
- Description and ingredients share a measured grid area, so switching tabs reserves the height of both views.
- Preview-shell code, theme controls, bundled React/GSAP copies and analytics are not included. Installed React, React DOM and GSAP are bundled once by esbuild.
- Original external data URLs have been extracted into local assets.
