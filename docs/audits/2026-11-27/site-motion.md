# Carousel motion across the site

27 November 2026

The homepage and three program pages now share the carousel's opposing title wipes, circular photo entrances and unfolding lime bands. Section effects reverse on exit and replay on return. Cards enter in a short sequence, photos and action arrows respond to hover, and changed prices and weekly menu items receive a separate reveal. All effects are finite. The original carousel retains its existing animation controller.

Native Web Animations and IntersectionObserver handle the added effects. A reduced-motion preference cancels current effects, disconnects the observer and restores visible content. Keyboard focus finishes the containing section's entry immediately. A failed animation API also leaves content visible. No new runtime dependency was added.

## Verification

- Built all four routes, validated internal links, assets and JavaScript.
- Five Node tests execute the controller in a simulated DOM. They cover reduced motion at startup, preference changes, keyboard visibility, replay and animation failure. These are lifecycle tests, not browser rendering measurements.
- In the browser, observed partial title wipes, growing bands and entering photos in the trial day and reviews. Captured intermediate and settled frames in `research/site-motion`, outside the repository.
- Checked the homepage's pricing at 1280 px. Selecting twenty days produced 165 000, 222 000 and 232 000 KZT. The program detail page carried 222 000 KZT and changed to 55 500 KZT for five days.
- Keyboard navigation to pending review buttons revealed both the entered card and the next focused card immediately.
- Reviewed the first screen, pricing, trial day, reviews, company, team, contacts, footer and program detail. No pending invisible targets remained in the checked visible regions after entry.
- No page overflow in the checked 390 px homepage, 768 px contacts, 1280 px homepage, or 320 px program pricing. Fixed the mobile facts panel: its horizontal centering now uses the independent translate property, so the vertical entry transform preserves its position.
- Browser console contained no errors during the checks.

The browser tool exposes viewport resizing but no media emulation. Reduced-motion cleanup was verified by the lifecycle tests and source review, not by an emulated browser preference. Intermediate screenshot sequences made during smooth anchor navigation include the page travelling to the target; they are not timing benchmarks. Desktop captures from the tool are visibly compressed.
