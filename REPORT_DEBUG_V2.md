# Pina Games - Debug Report V2

Date: 2026-05-02
Repository: pablosandri05-a11y/pina-games
Scope: 24 HTML files

## Executive summary

All HTML files were scanned for ad-blocker-sensitive identifiers, external scripts, fetch/XHR calls, unsandboxed iframes, placeholder links, missing local assets, viewport tags, JavaScript syntax errors, and mobile layout risks.

New fixes made in this pass:

- Fixed broken PDF links for cards 04-10 in `index.html`.
- Added SEO and Open Graph metadata to `index.html`.
- Removed Google Fonts `@import` calls from cards 04-10 so the standalone HTML games no longer depend on external font CSS.
- Reworked the card 18 timeline layout to remove `min-width:600px`; it now uses a responsive grid and stacks on small screens.

Previously fixed and rechecked:

- `game_02_what_is_ai_good_at.html`: answer feedback no longer gets destroyed by a full rerender.
- `game_03_does_ai_think_like_a_human.html`: same rerender feedback bug remains fixed.

## Verification results

| Check | Result |
|---|---|
| Ad-blocker-sensitive class/id names | No matches in HTML files |
| External `<script src>` | None |
| External `fetch()` / `XMLHttpRequest` | None |
| `<iframe>` elements | None |
| Placeholder links/content | None |
| Local href/src and generated index references | OK |
| Viewport meta tag | Present in all 24 HTML files |
| JavaScript syntax | OK in all 24 HTML files |
| Fixed `width` / `min-width` over 400px | None found; remaining matches are `max-width` or media-query breakpoints |
| External blocking font CSS in game HTML | Removed |

## Bugs fixed

### 1. Broken PDF links in `index.html`

Cards 04-10 pointed to legacy mixed-case filenames such as `Card_04_Can_AI_Make_Mistakes_pdf.pdf`. The repository actually contains lowercase files such as `card_04_can_ai_make_mistakes.pdf`.

Fix: updated all card 04-10 PDF references in the homepage card data.

### 2. External Google Fonts requests in cards 04-10

Seven standalone activity files used `@import url('https://fonts.googleapis.com/...')` inside `<style>`. This made the HTML less self-contained and added blocking external CSS requests in the head.

Fix: removed the `@import` lines. The pages fall back to locally available/system fonts.

### 3. Card 18 mobile layout risk

`game_18_job_timeline.html` used `.timeline{min-width:600px}` with horizontal overflow. This violated the fixed-width mobile check and could force horizontal scrolling on phones.

Fix: replaced the flex/min-width timeline with a five-column CSS grid and a mobile media query that stacks eras into one column.

### 4. SEO metadata missing

`index.html` had only a title and viewport metadata. It lacked a description, Open Graph title/description/image, URL, and Twitter card metadata.

Fix: added a concise meta description, OG title, OG description, OG type, OG URL, OG image, and Twitter summary card.

## File-by-file result

| File | Result |
|---|---|
| `index.html` | Fixed PDF links; added SEO/OG metadata |
| `card4-extension.html` | Removed Google Fonts `@import`; no other issues found |
| `card5-extension.html` | Removed Google Fonts `@import`; no other issues found |
| `card6-trustmeter.html` | Removed Google Fonts `@import`; no other issues found |
| `card7-responsibility-chain.html` | Removed Google Fonts `@import`; no other issues found |
| `card8-fairness-chooser.html` | Removed Google Fonts `@import`; no other issues found |
| `card9-who-should-decide.html` | Removed Google Fonts `@import`; no other issues found |
| `card10-privacy-sorter.html` | Removed Google Fonts `@import`; no other issues found |
| `game_01_where_ai_lives.html` | No issues found |
| `game_02_what_is_ai_good_at.html` | Previous feedback-render fix confirmed |
| `game_03_does_ai_think_like_a_human.html` | Previous feedback-render fix confirmed |
| `game_11_prompt_trainer.html` | No issues found |
| `game_12_detection_lab.html` | No issues found |
| `game_13_carbon_counter.html` | No issues found |
| `game_14_dataset_builder.html` | No issues found |
| `game_15_creative_turing_test.html` | No issues found |
| `game_16_data_mapper.html` | No issues found |
| `game_17_study_smart.html` | No issues found |
| `game_18_job_timeline.html` | Removed `min-width:600px`; timeline is now responsive |
| `game_19_ownership_simulator.html` | No issues found |
| `game_20_theatre_machine.html` | No issues found |
| `game_21_manipulation_detector.html` | No issues found |
| `game_22_policy_simulator.html` | No issues found |
| `game_23_governance_game.html` | No issues found |

## Commands/checks run

- Static reference check with Node over all `href`, `src`, and generated `index.html` `pdf`/`game` entries.
- `rg` scans for ad-blocker-sensitive identifiers.
- `rg` scans for external scripts, `fetch`, XHR, iframes, placeholders, and blocking font imports.
- Node `vm.Script` syntax check over every inline `<script>` block.

