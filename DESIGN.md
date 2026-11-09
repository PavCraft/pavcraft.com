---
name: Pavcraft
description: Brand world for pavcraft.com, a flat acid-lime board of handwritten paper notices with tear-off tabs and censored marker scribbles, everything draggable.
colors:
  ground: "#D9FF41"
  ground-ink: "rgba(28,40,0,0.07)"
  paper: "#FFFFFF"
  paper-old: "#F1EEE4"
  ink: "#141414"
  ink-2: "#3E3D38"
  pen: "#2B35E8"
  pen-deep: "#1A22B8"
  marker-red: "#CF1452"
  cut: "#9A978E"
  tape: "rgba(240,232,190,0.72)"
  sticker-yellow: "#E8C23A"
  sticker-tape: "rgba(236,224,170,0.96)"
typography:
  display:
    fontFamily: "Playpen Sans, cursive"
    fontSize: "clamp(38px, 5.4vw, 70px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline-feature:
    fontFamily: "Playpen Sans, cursive"
    fontSize: "clamp(40px, 4.6vw, 58px)"
    fontWeight: 800
    lineHeight: 1.05
  headline:
    fontFamily: "Playpen Sans, cursive"
    fontSize: "clamp(30px, 3.2vw, 40px)"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "Playpen Sans, cursive"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Playpen Sans, cursive"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.2
  scribble:
    fontFamily: "Shantell Sans, Playpen Sans, cursive"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1
rounded:
  none: "0px"
  sticker: "3px"
  round: "50%"
spacing:
  sm: "14px"
  md: "28px"
  lg: "40px"
  gutter: "32px"
components:
  notice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "30px 28px 16px"
  notice-old:
    backgroundColor: "{colors.paper-old}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "30px 28px 16px"
  tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    typography: "{typography.label}"
    height: "132px"
  slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  sticker-round:
    backgroundColor: "{colors.sticker-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
  sticker-price:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.marker-red}"
    rounded: "{rounded.sticker}"
  sticker-blue:
    backgroundColor: "{colors.pen}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
---

# Design System: Pavcraft

## Overview

**Creative North Star: "The Notice Nobody Authorised"**

Pavcraft's home is a flat acid-lime board with plain white paper notices taped onto it. Each tool is one notice with tear-off tabs; tearing a tab takes you to the tool. Around the notices sit marker scribbles in rude Ukrainian, each swear word hidden under a peelable sticker. The owner pinned this direction on 2026-11-09: make an own variant, keep only notices and tear-off tabs. Everything else of the previous stairwell wall was dropped.

The mood is loud, playful and a little cheeky, but the content stays practical: one tool per notice, one action per tab. The lime ground is a single flat colour with no texture, no gradient and no photograph. Depth comes only from paper-shaped shadows. The board must stay field-neutral: tool pages have their own worlds (Pricing Kit is a receipt).

Everything on the board can be picked up and re-stuck: papers by tape or body, scribbles by their text, with grab and grabbing cursors telling you so.

**Key Characteristics:**
- One flat acid-lime ground (#D9FF41); white and yellowed paper; one ballpoint blue as the action colour; one marker pink-red for scribbles.
- Two handwritten faces only: Playpen Sans for paper, Shantell Sans for marker scribbles.
- Tear-off tabs are the navigation; a cut line that never moves.
- Censor stickers over swear words, peeled by tap.
- Every paper and scribble is draggable; positions persist per viewer.

## Colors

A single acid-lime board with white office paper, near-black ink, one electric ballpoint blue and one hot marker pink-red.

### Primary
- **Acid Lime Board** (#D9FF41): the whole page ground, theme-color, favicon tile. Never covered by a large panel of another colour.
- **Ballpoint Blue** (#2B35E8): the only action colour on paper: links, tab labels, "Написати", focus ring, text selection, the blue censor sticker. Hover deepens to Deep Ballpoint (#1A22B8).

### Secondary
- **Marker Pink-Red** (#CF1452): marker scribbles that shout, and the price-tag censor sticker text.

### Neutral
- **Office Paper** (#FFFFFF): notices, slips, the brand tag, the hero note, tear-off tabs.
- **Yellowed Paper** (#F1EEE4): older notices for future tools ("Наступний інструмент"), with softer ink.
- **Felt-Tip Ink** (#141414): headings and scribbles; **Soft Ink** (#3E3D38) for secondary text on paper.
- **Cut Line Grey** (#9A978E): the dashed tear line and tab separators.
- **Masking Tape** (rgba 240,232,190 at 0.72): translucent crimped tape; **Sticker Yellow** (#E8C23A) and **Sticker Tape** (rgba 236,224,170 at 0.96) for censor stickers.
- **Ghost Ink** (rgba 28,40,0 at 0.07): oversized background words ("Рутина", "Маржа", "Ціни") as texture only, hidden from assistive tech.

### Named Rules
**The One Ground Rule.** The ground is acid lime and nothing else. No second wall colour, no dark mode, no overlays.

**The Ballpoint Rule.** Blue means "you can act here". Pink-red and black are for scribbles, never for links.

## Typography

**Display Font:** Playpen Sans (cursive fallback)
**Body Font:** Playpen Sans (cursive fallback)
**Scribble Font:** Shantell Sans (falls back to Playpen Sans), bounce and informality axes at 100, uppercase

**Character:** Playpen Sans is the neat hand of the paper notices: readable Cyrillic, rounded, friendly. Shantell Sans at heavy weight with "BNCE" and "INFM" at 100 is the marker on the wall: bouncy and uppercase. Both are self-hosted OFL variable woff2 subsets (latin, cyrillic, cyrillic-ext).

### Hierarchy
- **Display** (800, clamp 38px to 70px, 1.0, -0.02em): the H1 on the board, max 13ch, rotated -1.5deg.
- **Headline feature** (800, clamp 40px to 58px, 1.05): the Pricing Kit notice title, with a 600-weight "for whom" line beneath.
- **Headline** (800, clamp 30px to 40px, 1.05): other notice titles.
- **Body** (400, 21px, 1.45; 19px on phones): notice text at max 34ch.
- **Label** (600, 19px; 17px on old paper): vertical tab text; links "Відкрити ..." (700, 21px, underlined) and the reset button use the same hand.
- **Scribble** (800, 22px to 30px, uppercase, Shantell Sans): wall writing only, never paper text.

### Named Rules
**The Two Hands Rule.** Paper speaks in Playpen Sans, the wall speaks in Shantell Sans. No third face, no system display faces.

## Layout

A 12-column grid in a 1180px container with 32px gutters (16px on phones), 40px row gap and 28px column gap. Notices are placed deliberately off-grid by a few pixels and rotated up to about 2.4 degrees; the Pricing Kit notice spans 7 columns beside the 5-column "Що вам заважає?" notice. Below 860px the grid is one column with 44px gaps and some scribbles are hidden; below 560px type steps down. Marker scribbles are absolutely positioned on the board in their own layer.

Dragged positions are stored per viewer as offset, angle and stacking order, with separate keys for desktop and mobile layouts, and clamped so a stuck paper stays on the page. A "Повісити все як було" button appears once anything has moved.

## Elevation & Depth

Flat ground, shadows only on paper. Shadows follow the paper's own silhouette (drop-shadow filters: `0 7px 8px rgba(0,0,0,.32)` plus `0 1px 1px rgba(0,0,0,.18)`), never a backing panel. A lifted paper gets a larger shadow (`0 22px 22px rgba(0,0,0,.34)`), scale 1.03 and a straightened angle; a lifted scribble gets `drop-shadow(0 10px 10px rgba(0,0,0,.25))`. Torn tabs have no shadow and no backing: the lime shows through the tear.

### Named Rules
**The Silhouette Shadow Rule.** Shadows on paper are drop-shadow filters that trace the paper's shape. Box-shadow panels behind papers are forbidden; box-shadow is allowed only on small stickers.

## Shapes

Paper is square-cornered and rotated slightly; nothing is rounded except the censor stickers (50% and 3px). Edges are made by cut: dashed 2px tear lines (#9A978E) at the foot of a sheet and between tabs; torn tabs get a ragged zigzag top edge by mask; tape is a crimped-edge masked strip about 28px tall, 112px wide (64px small), slightly rotated.

## Components

### Notice (paper)
White (or yellowed for future tools) sheet, 30px 28px 16px padding, dashed tear line at the bottom, taped by a translucent strip. The whole paper is a drag handle (grab cursor); links inside keep a pointer cursor.

### Tear-off Tabs
Equal-width vertical-text tabs under the sheet, 132px high (118px on phones), separated by dashed cut lines. The cut line belongs to the sheet and never moves. A tab labelled with the tool name opens it; "за попитом" tabs on old paper are inert. Mouse: hover tilts -5deg; press and pull to tear a tab into a ghost that follows the pointer; release and it falls away and navigates (mailto navigates at once). Touch: hold still about 260ms to arm (the tab tilts and drops 3px), then pull; a swipe keeps scrolling the page. A plain click tears and navigates. Torn tabs stay ragged until Back restores them. Reduced motion skips animation.

### Tape and Slips
A tape strip at the top of every paper is the explicit grab handle (focusable; arrow keys move 16px, Shift 48px). Touch picks up any paper or scribble after holding still about 320ms. The header carries a brand tag (800, 24px) and a "Написати" slip in Ballpoint Blue.

### Censor Stickers
Swear words in marker scribbles are covered by a sticker: round yellow "18+", masking-tape "цензура", white price tag "−100%" in pink-red, blue "***". Tap peels the sticker off with a short rotating fall and reveals the word. Stickers are buttons out of the tab order; the scribble itself is draggable.

### Reset
A small paper button "Повісити все як було", 44px tall, rotated -1deg, shown only after something moved.

## Do's and Don'ts

### Do:
- **Do** keep the ground a flat #D9FF41 and let the lime show through gaps and torn tabs.
- **Do** make every paper and scribble draggable, with grab and grabbing cursors, and keep links on paper pointer-cursor.
- **Do** cover every swear word with a peelable sticker; the owner asked for this device explicitly.
- **Do** keep a tear line fixed when a tab lifts, and give a held tab on touch a short hold before pulling so scroll still works.
- **Do** use Ballpoint Blue (#2B35E8) for every actionable element on paper.
- **Do** keep 44px minimum targets for links and buttons.

### Don't:
- **Don't** add a second wall colour, texture, photo or dark section to the board.
- **Don't** put shadows or a backing under a torn tab, or a backing panel behind a paper.
- **Don't** use any face other than Playpen Sans and Shantell Sans; Pangolin and Caveat are retired.
- **Don't** dress future tools as finished: they are yellowed notices with "за попитом" tabs, not a promise.
- **Don't** put rude words in body text, titles, meta or links; they live only in marker scribbles under stickers.
- **Don't** bring back the stairwell wall, plaster grain, oil-paint green or whitewash of the previous home.
