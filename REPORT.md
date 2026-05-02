# Pina Games — Debug Report
**Date:** 2026-05-02  
**Scope:** Ad-blocker check · JS error check · Link check · Mobile check  
**Files examined:** 24 HTML files

---

## Summary of findings

| Check | Result |
|---|---|
| Ad-blocker (class/ID names, external scripts, fetch/XHR, iframes) | No issues in any file |
| JS errors (variables before declaration, null querySelector, broken syntax) | 2 bugs fixed (game_02, game_03) |
| Broken/placeholder links | None found |
| Mobile viewport tag | Present in all 24 files |
| Fixed widths > 400px | None found |

---

## File-by-file report

### index.html
Nessun problema trovato.

### card4-extension.html
Nessun problema trovato.  
Note: uses Google Fonts `@import` (external CSS request — not an ad-blocker trigger per the check criteria, but may fail in strict offline environments).

### card5-extension.html
Nessun problema trovato.  
Note: uses Google Fonts `@import`.

### card6-trustmeter.html
Nessun problema trovato.  
Note: uses Google Fonts `@import`.

### card7-responsibility-chain.html
Nessun problema trovato.  
Note: uses Google Fonts `@import`.

### card8-fairness-chooser.html
Nessun problema trovato.  
Note: uses Google Fonts `@import`.

### card9-who-should-decide.html
Nessun problema trovato.  
Note: uses Google Fonts `@import`.

### card10-privacy-sorter.html
Nessun problema trovato.  
Note: uses Google Fonts `@import`.

### game_01_where_ai_lives.html
Nessun problema trovato.

### game_02_what_is_ai_good_at.html
**BUG FIXED — JS error: `render()` called inside `answer()` destroyed feedback state**

Root cause: `answer()` set button disabled states, class names, feedback text, and next-button visibility, then called `render()` which rebuilt the entire `#game-area` innerHTML, immediately erasing all those changes. Feedback and button colouring were never visible to the user.

Fix applied: extracted a new `updateDots()` function that redraws only the progress dots bar (no question card rebuild). Replaced the `render()` call inside `answer()` with `updateDots()`. The full `render()` continues to be called correctly from `next()` and `restart()`.

### game_03_does_ai_think_like_a_human.html
**BUG FIXED — identical JS error to game_02**

Root cause: same pattern — `answer()` called `render()` which rebuilt `#game-area`, erasing the feedback, button colours, and next-button.

Fix applied: same approach — extracted `updateDots()` (which also updates the `#step-label` counter), replaced the `render()` call inside `answer()` with `updateDots()`.

### game_11_prompt_trainer.html
Nessun problema trovato.

### game_12_detection_lab.html
Nessun problema trovato.

### game_13_carbon_counter.html
Nessun problema trovato.

### game_14_dataset_builder.html
Nessun problema trovato.

### game_15_creative_turing_test.html
Nessun problema trovato.

### game_16_data_mapper.html
Nessun problema trovato.

### game_17_study_smart.html
Nessun problema trovato.

### game_18_job_timeline.html
Nessun problema trovato.

### game_19_ownership_simulator.html
Nessun problema trovato.

### game_20_theatre_machine.html
Nessun problema trovato.

### game_21_manipulation_detector.html
Nessun problema trovato.

### game_22_policy_simulator.html
Nessun problema trovato.

### game_23_governance_game.html
Nessun problema trovato.

---

## Ad-blocker check details

Checked all class="" and id="" attributes for the following tokens (whole-word matching):
ad, ads, banner, track, tracking, pixel, analytics, sponsor, promo, popup, modal

Result: no flagged identifiers found in any file.

Also checked:
- External <script src="..."> tags — none found in any file
- External fetch() / XHR calls — none found in any file
- Unsandboxed <iframe> elements — none found in any file

---

## Mobile check details

All 24 files include <meta name="viewport" content="width=device-width, initial-scale=1.0">.
No inline or CSS fixed widths greater than 400px were found. The largest fixed width found was 280px (.puzzle-image in card4-extension.html), which is safe and has a media-query override at 230px for small screens.

---

## Changes made

| File | Change |
|---|---|
| `game_02_what_is_ai_good_at.html` | Added `updateDots()` function; replaced `render()` call in `answer()` with `updateDots()` |
| `game_03_does_ai_think_like_a_human.html` | Added `updateDots()` function; replaced `render()` call in `answer()` with `updateDots()` |
| `REPORT.md` | Created this report |
