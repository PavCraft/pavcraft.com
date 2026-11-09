---
name: Pavcraft
description: Brand world for pavcraft.com, a stairwell wall of handwritten paper notices with tear-off tabs for Ukrainian small business.
colors:
  whitewash: "#E7E3D9"
  trim: "#3F5F55"
  panel: "#6E9686"
  paper: "#FBFAF6"
  paper-old: "#EAE4D3"
  ink: "#1D1D1B"
  ink-2: "#45423B"
  pen: "#1F47B8"
  pen-deep: "#15348A"
  marker-red: "#C62A22"
  cut: "#8B877E"
  tape: "rgba(236,224,170,0.6)"
typography:
  display:
    fontFamily: "Pangolin, Caveat, cursive"
    fontSize: "clamp(40px, 6vw, 76px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline-feature:
    fontFamily: "Pangolin, Caveat, cursive"
    fontSize: "clamp(40px, 4.6vw, 58px)"
    fontWeight: 400
    lineHeight: 1.05
  headline:
    fontFamily: "Pangolin, Caveat, cursive"
    fontSize: "clamp(30px, 3.2vw, 40px)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Caveat, Pangolin, cursive"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.3
  body-note:
    fontFamily: "Caveat, Pangolin, cursive"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Pangolin, Caveat, cursive"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.1
  label-tab:
    fontFamily: "Caveat, Pangolin, cursive"
    fontSize: "23px"
    fontWeight: 700
    lineHeight: 1
  scribble:
    fontFamily: "Caveat, Pangolin, cursive"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1
spacing:
  gutter-phone: "16px"
  gutter: "32px"
  grid-col-gap: "28px"
  grid-row-gap: "40px"
  sheet-x: "28px"
  sheet-top: "30px"
  container: "1180px"
components:
  notice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "30px 28px 16px"
  notice-old:
    backgroundColor: "{colors.paper-old}"
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
    padding: "30px 28px 16px"
  tear-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    typography: "{typography.label-tab}"
    height: "132px"
    width: "44px"
    padding: "12px 8px"
  action-link:
    textColor: "{colors.pen}"
    typography: "{typography.label}"
    height: "44px"
    padding: "8px 0"
  action-link-hover:
    textColor: "{colors.pen-deep}"
  brand-slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "12px 16px 10px"
  contact-slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.pen}"
    padding: "10px 16px"
  tape:
    backgroundColor: "{colors.tape}"
    height: "44px"
    width: "112px"
  reset-slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "44px"
    padding: "10px 14px"
---

# Design System: Pavcraft

Scope: this file is the Pavcraft brand system (the home page at `/` and brand-level elements such as the favicon). Each product page owns its own world; Pricing Kit's receipt world lives in `design/pricing-kit/DESIGN.md` and must not be mixed into this one, nor this one into it. Commissioner and Martian Mono in `public/fonts` belong to Pricing Kit, not to the brand.

## Overview

**Creative North Star: "The Stairwell Notice Board"**

Pavcraft's catalogue is the notice board nobody authorised: paper notices taped to a Ukrainian stairwell (під'їзд) wall. The wall is whitewash above and oil-painted green below, split by a dark trim stripe, with fine plaster grain over both and marker scribbles left by neighbours. Each tool is one notice with tear-off tabs; tearing a tab takes you to the tool. Everything a visitor reads is handwritten, as if by the developer with a felt-tip and a ballpoint.

The density is loose and human. Papers hang at slight angles (up to about 4 degrees), break the grid with uneven offsets, and cast shadows that follow their own outline. The page is a place you can touch: every paper peels off by its tape, follows the pointer with a deeper shadow, and sticks where it is dropped at a new small angle. The world refuses the SaaS grid of identical tool cards and the dark tech hero.

Tools that do not exist yet appear as yellowed, older notices whose tabs cannot be torn. The brand mark is not a logo but a taped paper slip reading "PAVCRAFT / інструменти для малого бізнесу".

**Key Characteristics:**
- Two-tone stairwell wall (whitewash band over green panel, dark trim line) with plaster grain.
- All type handwritten: Pangolin for headings, slips and controls; Caveat for text, tabs and scribbles.
- Paper notices with crimped translucent tape, dashed cut lines and vertical tear-off tabs.
- Ballpoint blue is the only action colour.
- Peel-and-re-stick interaction on every paper, persisted per viewer, with a reset slip.

## Colors

A muted municipal palette (whitewash, institutional green, office paper) with ink and two marker colours doing all the talking.

### Primary
- **Ballpoint Blue** (pen): the only action colour. Links, tab labels, the "Написати" slip, focus rings, text selection, and the highlighted beta line inside the Pricing Kit notice.
- **Pressed Ballpoint** (pen-deep): hover state of the main action link.

### Secondary
- **Marker Red** (marker-red): wall scribbles only, notably "ОГОЛОШЕННЯ НЕ КЛЕЇТИ!" and the hand-drawn heart. Never on paper, never for actions. Where a red scribble falls on the green panel at phone widths, the build darkens it to a deep oxblood (#7A1712) so it stays readable.

### Neutral
- **Stairwell Whitewash** (whitewash): the upper wall band, behind the header and headline. Also the browser theme colour.
- **Trim Stripe** (trim): the 7px dark green line where whitewash meets paint.
- **Oil-Paint Green** (panel): the lower wall, behind the notices and footer; also the page background beyond the body.
- **Office Paper** (paper): current notices, slips, the note, the reset slip.
- **Yellowed Paper** (paper-old): notices for tools that do not exist yet.
- **Felt-Tip Black** (ink): headings and main text; black marker scribbles.
- **Faded Ink** (ink-2): secondary lines (subtitle under the Pricing Kit heading, meta lines, text on yellowed paper).
- **Cut-Line Grey** (cut): the dashed line above tear-off tabs and between tabs.
- **Masking Tape** (tape): translucent yellowish tape; slightly more opaque on hover.

### Named Rules
**The One Pen Rule.** Ballpoint blue marks everything that acts. Nothing else on paper is blue, and nothing that acts is any other colour.

**The Wall Speaks Red Rule.** Marker red belongs to the wall (scribbles), not to the papers. It never signals an action or an error.

## Typography

**Display Font:** Pangolin (with Caveat, cursive)
**Body Font:** Caveat (with Pangolin, cursive)

**Character:** Pangolin reads as careful felt-tip print, legible enough for headings and controls; Caveat is quick ballpoint and marker handwriting for running text, tabs and scribbles. Both are self-hosted (OFL) with Cyrillic, Cyrillic-ext and Latin subsets; Pangolin has a single weight (400), Caveat is variable 400 to 700.

### Hierarchy
- **Display** (Pangolin 400, clamp(40px, 6vw, 76px), 1.02, -0.01em): the page headline, written straight on the whitewash, rotated -1.5 degrees, max 15ch, balanced wrapping.
- **Headline Feature** (Pangolin 400, clamp(40px, 4.6vw, 58px), 1.05): the heading of the lead tool notice, followed by a Faded Ink subtitle in Pangolin at clamp(24px, 2.4vw, 30px).
- **Headline** (Pangolin 400, clamp(30px, 3.2vw, 40px), 1.05): headings of other notices.
- **Body** (Caveat 400, 24px, 1.3; 22px on phones): notice text, max 34ch per paragraph. Meta lines use weight 600 in Faded Ink; emphasis uses weight 700 in Ballpoint Blue.
- **Body Note** (Caveat 400, 26px, 1.35; 23px on phones): the taped note under the headline, max 30ch.
- **Label** (Pangolin 400, 19 to 24px): brand slip, contact slip, action link, reset slip, footer.
- **Label Tab** (Caveat 700, 23px; 21px on phones; 19px on yellowed notices): tear-off tab text, set vertically, reading bottom to top.
- **Scribble** (Caveat 700, 26 to 38px, line-height 1): marker writing on the wall, each rotated individually.

### Named Rules
**The Handwritten-Only Rule.** Every visible letter on the brand surface is Pangolin or Caveat. No system sans, no geometric display face.

**The Print-For-Structure Rule.** Pangolin carries structure (headings, slips, controls); Caveat carries voice (text, tabs, scribbles). Do not swap their roles.

## Layout

A centred wall section, max 1180px wide, with 32px side gutters (16px on phones). The wall band split sits at 470px from the top on desktop, 420px at 860px and below, 380px at 560px and below, so the header and headline sit on whitewash and the notices on green paint.

Header: brand slip left, contact slip right, top-aligned, 30px from the top. The headline and its taped note follow, then the notices on a 12-column grid (row gap 40px, column gap 28px): the lead tool notice spans 7 columns, the side notices 5; the about note spans 6 with a 40px left offset. Notices carry small negative or positive top margins so their edges do not line up.

At 860px and below the grid collapses to one column (gap 44px), rotations soften (1 to 1.6 degrees), and some scribbles are hidden or moved so they do not collide with notices. At 560px and below a second "тут була рутина" scribble appears under the headline, and sheet padding tightens to 28px 20px 14px. The footer sits on the green panel with generous top padding (110px desktop, 230px at 860px and below) to leave room for the bottom scribbles.

## Elevation & Depth

Depth is physical: paper on a wall. Every paper uses a two-layer drop-shadow filter, so the shadow follows the paper's real outline, including the ragged stub of a torn tab and the tape. There are no backing panels or boxes behind papers. A lifted paper gets a larger, softer shadow and a 3% scale-up; it settles back with a short ease-out.

### Shadow Vocabulary
- **Stuck** (`filter: drop-shadow(0 7px 8px rgba(0,0,0,.32)) drop-shadow(0 1px 1px rgba(0,0,0,.18))`): every paper at rest.
- **Lifted** (`filter: drop-shadow(0 22px 22px rgba(0,0,0,.34)) drop-shadow(0 2px 3px rgba(0,0,0,.2))`): a paper being dragged.

### Named Rules
**The Shadow Follows Paper Rule.** Shadows are drop-shadow filters on the paper itself, never box-shadow on a rectangle and never a panel behind the paper. A torn tab leaves only the ragged paper stub, with nothing behind it but the wall.

## Shapes

Papers are sharp-cornered rectangles, rotated individually through a per-paper angle variable. Edges are broken only where paper is broken: tape has crimped (zigzag) ends drawn with a mask, and a torn tab is a ragged stub drawn with a mask. Cut lines are 2px dashed Cut-Line Grey. Marker drawings on the wall (arrow, heart) are hand-drawn inline SVG strokes with round caps and joins in the scribble's own colour. The favicon is the only rounded shape (6px on a 32px tile) and shows the wall split with one taped notice and its tabs.

## Components

### Notice (signature)
Tactile and plain, like a sheet of office paper.
- **Structure:** tape across the top edge, a sheet (heading, text, optional action link), then an optional row of tear-off tabs below a dashed cut line.
- **Background:** Office Paper; Yellowed Paper for tools that do not exist yet, where text drops to Faded Ink and tabs to a grey-brown, smaller label.
- **Padding:** 30px 28px 16px (28px 20px 14px on phones). A notice without tabs has no cut line and 22px bottom padding.
- **Rotation:** about -2 to 2.4 degrees on desktop.
- **Heading link:** no underline at rest; underline in Ballpoint Blue on hover.

### Tear-off Tabs (signature)
- **Shape:** equal-width strips (min 44px wide, 132px tall; 120px on phones) with vertical Caveat 700 text in Ballpoint Blue, separated by dashed cut lines.
- **Hover:** the tab peels, rotating -5 degrees around its top edge (0.18s, cubic-bezier(.16,1,.3,1)); the cut line stays put because it belongs to the sheet.
- **Click:** the tab tears off (rotates, drops 120px, fades, 0.42s) and the browser then navigates. Without script, or under reduced motion, tabs are plain links.
- **Torn:** one tab per notice may already be a ragged stub with no backing.
- **Accessibility:** the tab row is hidden from assistive tech and out of the tab order; each notice carries a real link (heading and action link) for keyboard and screen readers.

### Tape (signature control)
- **Style:** translucent Masking Tape strip, 112px wide by default (64px small, per-paper overrides), crimped ends, rotated a few degrees, overlapping the paper's top edge by 22px.
- **Role:** the tape is a real button: grab cursor, 44px hit area, label naming the paper and the keyboard behaviour. Hover makes the tape more opaque.
- **Drag:** pointer on the tape lifts the paper immediately; with a mouse, the paper body can also be dragged after a 5px threshold. On drop the paper sticks at a new random angle between -3 and 3 degrees, is kept fully on screen, and the position is saved for that viewer (separately for phone and desktop layouts).
- **Keyboard:** arrow keys move the paper 16px (48px with Shift) and a polite live region announces "Переклеєно".

### Action Link
- **Style:** Pangolin 24px, Ballpoint Blue, 2px underline, at least 44px tall.
- **Hover:** shifts to Pressed Ballpoint.

### Slips (brand, contact, note, reset)
- **Brand slip:** Office Paper, "PAVCRAFT" in Pangolin with a Caveat 600 Faded Ink line under it, small tape, -1.5 degrees.
- **Contact slip:** Office Paper, "Написати" in Ballpoint Blue Pangolin, small tape, 2 degrees; underline on hover.
- **Note:** the taped text under the headline, Body Note size.
- **Reset slip:** "Повісити все як було", a paper button in the footer, hidden until the viewer has moved something; underline on hover.

### Wall Scribbles
Marker writing on the wall in Felt-Tip Black, Marker Red or Office Paper white (chalky), Caveat 700, each with its own rotation (-6 to 7 degrees). Decorative and hidden from assistive tech; never interactive. Some carry a strikethrough or a hand-drawn SVG (arrow, heart).

### Focus
Every link and button focuses with a 3px Ballpoint Blue outline offset by 3px. A skip link on Office Paper appears at the top left on focus.

## Do's and Don'ts

### Do:
- **Do** keep the wall two-tone: whitewash band over oil-paint green with the 7px trim line, plaster grain over both.
- **Do** set every visible letter in Pangolin or Caveat, Pangolin for structure, Caveat for voice.
- **Do** present each tool as one notice with tear-off tabs that all point to that tool's single address.
- **Do** give every paper a tape button so it can be peeled, moved with arrow keys and re-stuck, and keep "Повісити все як було" as the way back.
- **Do** cast shadows with drop-shadow filters on the paper itself.
- **Do** use Ballpoint Blue for every action and nothing else on paper.
- **Do** honour reduced motion: no peel, tear or settle animation, links still work without script.

### Don't:
- **Don't** build a grid of identical tool cards or a dark tech hero.
- **Don't** put a backing panel, box or shadowed rectangle behind a paper or a torn tab.
- **Don't** move the cut line when a tab peels; the tab moves, the sheet stays.
- **Don't** use Marker Red for actions, errors or anything on paper.
- **Don't** reuse the Pricing Kit receipt world (or its Commissioner and Martian Mono faces) on brand surfaces.
