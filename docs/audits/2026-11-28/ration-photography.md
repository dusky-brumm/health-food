# Daily rations as the primary imagery

28 November 2026

Replaced individual plate cutouts in the homepage hero, all three pricing cards, both trial-day sections and program-page heroes/trial sections with full daily sets. Each program uses the photograph assigned to it on the original site. The dish-example carousel remains a separate, secondary look at individual dishes.

## Assets

| Program | Original image | Local WebP | Dimensions | Bytes |
| --- | --- | --- | --- | --- |
| Weight loss | [39441716.jpg](https://health-food.kz/img/39441716.jpg) | `dist/assets/rations/light.webp` | 960 × 1200 | 237034 |
| Balance | [39441684.jpg](https://health-food.kz/img/39441684.jpg) | `dist/assets/rations/balance.webp` | 960 × 1197 | 142412 |
| Mass gain | [39441589.jpg](https://health-food.kz/img/39441589.jpg) | `dist/assets/rations/power.webp` | 960 × 1200 | 141322 |

Photos were resized proportionally and encoded at WebP quality 84, without changing their content. Original JPEG downloads are archived outside the repository in `research/ration-imagery/originals/`. All three served files total approximately 509 KiB and are reused across pages.

Images reserve their intrinsic dimensions. Critical hero photos have high fetch priority; cards and trial photos load lazily. Cards use `object-fit: contain`; other photos retain their natural aspect ratio. Portrait sets have no circular crop, hover movement or plate entrance animation. The homepage facts panel now sits below the photo rather than covering it. Mobile cards use a single column, including at 320 px.

## Verification

- Native browser checks: homepage hero and pricing at 1280 × 900 and 390 × 900; card layout at 320 × 900; program-page imagery and trial photo correspondence on all three routes.
- All three pricing photographs loaded and were fully contained; desktop cards have equal heights. No horizontal page overflow in the checked views.
- Twenty-day totals remain 165 000, 222 000 and 232 000 KZT; links carry the selected duration to the matching detailed page.
- The detailed page and trial section each use the matching program image. Browser console checks contained no errors.
- Built all four routes with `/health-food/`, validated internal links/assets and JavaScript, and passed `npm run check` and all six existing motion lifecycle tests.
- Screenshots saved outside the repository in `research/ration-imagery/`, including desktop/mobile heroes, pricing and program pages.

The photos are examples of the service's daily sets; they do not promise a particular current menu. Palette, typography, wavy section boundaries and the dish carousel's controls are unchanged.
