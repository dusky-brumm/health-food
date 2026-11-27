# Quieter motion

28 November 2026

Review headings, description, all eight cards, photos and names now stay visible without entry effects. Pricing, team, article, FAQ and related-program cards no longer enter separately. Card/photo lifts, rotations and zooms on hover were removed, including weekly menu cards and quiz program choices. Action arrows no longer move on hover. The original dish carousel is unchanged.

Other section headings and plate scenes enter once and stay visible on return. Body copy uses a 6 px, 420 ms entrance. Price and weekly-menu changes use a short opacity transition instead of a wipe or vertical movement. Colors and layout are unchanged.

## Verification

- Built four routes with `/health-food/`, verified internal links/assets and JavaScript, and passed `npm run check` and all six Node lifecycle tests.
- Browser checks at 1280 × 900 and 390 × 900: all eight reviews had opacity 1, no pending reveal class, no transforms and no horizontal page overflow. After leaving and returning, reviews remained static.
- Hovered the first review after opening its video and dismissing it with Escape: card transform/translate and image rotate/translate were all `none`. The dialog opened and keyboard focus returned to the review button. Browser console contained no errors.
- Selecting twenty days still produced 165 000, 222 000 and 232 000 KZT, with static pricing cards.
- Native browser screenshots saved outside the repository in `research/animation-reduction/reviews-desktop.jpg` and `reviews-mobile.jpg`. They are viewport captures, not animation timing measurements.

Chrome Modern Web Guidance `motion` informed the static defaults and visible final states. Reduced-motion cleanup is covered by the Node lifecycle tests and source review. Browser media emulation is unavailable in the current tool, so no runtime reduced-motion preference check is claimed.
