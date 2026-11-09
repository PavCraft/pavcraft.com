---
name: Pavcraft — Pricing Kit
description: Visual world of the Pricing Kit product page only (/pricing-kit/), a thermal receipt on a dark shop counter. Not the Pavcraft brand system.
colors:
  print-red: "#C8231A"
  print-red-pressed: "#9E1A13"
  counter: "#1B1A18"
  counter-ink: "#EDEAE2"
  counter-muted: "#CFCAC0"
  paper: "#F6F4EE"
  paper-pressed: "#ECE8DE"
  thermal-ink: "#1E1E1C"
  faded-ink: "#4F4B44"
  dash-rule: "#B9B4A8"
typography:
  display:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "clamp(27px, 5.2vw, 40px)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112.5"
  headline:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "clamp(20px, 3.2vw, 27px)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112.5"
  title:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "0em"
    fontVariation: "'wdth' 112.5"
  total:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "clamp(19px, 3.6vw, 26px)"
    fontWeight: 800
    lineHeight: 1.62
    fontVariation: "'wdth' 112.5"
    fontFeature: "'tnum' 1"
  receipt-line:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.62
    fontVariation: "'wdth' 75"
    fontFeature: "'tnum' 1"
  body:
    fontFamily: "Commissioner, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 75"
  button:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.2
    fontVariation: "'wdth' 112.5"
rounded:
  none: "0px"
spacing:
  strip-pad: "clamp(20px, 5vw, 56px)"
  line-gap: "3px"
  rule-gap: "18px"
  section-gap: "40px"
components:
  receipt-strip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.thermal-ink}"
    rounded: "{rounded.none}"
    padding: "28px clamp(20px, 5vw, 56px) 40px"
    width: "760px"
  button-primary:
    backgroundColor: "{colors.print-red}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.print-red-pressed}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.thermal-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.paper-pressed}"
  key-reprint:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.thermal-ink}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  nav-cta:
    backgroundColor: "{colors.print-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "7px 12px"
  loss-stamp:
    backgroundColor: "{colors.print-red}"
    textColor: "{colors.paper}"
    padding: "0 0.5ch"
---

# Design System: Pavcraft

## Overview

**Creative North Star: "The Receipt on the Counter"**

Every Pavcraft page is one long strip of thermal paper lying on a dark graphite shop counter. The strip carries everything: a store-header masthead, printed headings, item lines with dot leaders, totals in double width, dashed and starred cut rules, and a red coupon for the one action that matters. The counter around it carries only a thin nav. Margin is literally a receipt here: price minus costs, total printed at the bottom, red when it is a loss.

The system is flat, square and printed. Depth comes from paper lying on a darker surface, not from cards or layered panels. Martian Mono, set wide for headings and narrow for item lines, is the printer's voice; Commissioner carries paragraph prose because a 390px phone reader tires of monospace paragraphs. Colour is two-ink: thermal black and one second print colour, red, reserved for loss and the primary action. The page refuses the split hero (copy left, screenshot right) and the row of feature cards; content stacks down the strip in receipt order.

**Key Characteristics:**
- One centred paper strip (max 760px) on a graphite counter, with zigzag tear edges top and bottom.
- Two inks only: thermal black for everything, print red for loss and the primary action.
- Monospace receipt typography with tabular figures; sans-serif only for paragraphs.
- Square corners everywhere; dashed borders are the default stroke.
- State changes texture, not only colour: loss lines are struck through and reverse-printed.

## Colors

A warm, near-monochrome thermal palette with a single print-red second colour.

### Primary
- **Print Red** (`print-red`): the second print colour. Used for the primary action (beta application button, nav CTA), loss totals, the reverse-printed loss stamp, strike-through on loss values, minus markers in "won't fit" lists, focus outlines and text selection.
- **Pressed Red** (`print-red-pressed`): hover/pressed state of red actions only.

### Neutral
- **Graphite Counter** (`counter`): page background, html background, `theme-color`. Never used inside the strip.
- **Counter Light** (`counter-ink`): brand wordmark and hovered nav links on the counter.
- **Counter Dim** (`counter-muted`): resting nav links on the counter.
- **Thermal Paper** (`paper`): the strip surface, secondary button fill, text on red.
- **Pressed Paper** (`paper-pressed`): hover fill for secondary buttons and the reprint key.
- **Thermal Ink** (`thermal-ink`): all body and heading text on paper, solid button borders, dashed key and coupon borders.
- **Faded Ink** (`faded-ink`): secondary text on paper: masthead subline, small receipt lines, `.muted` notes, FAQ answers, footer.
- **Dash Rule** (`dash-rule`): dashed and starred cut rules, dot leaders. Decorative only; never text.

### Named Rules
**The Two-Ink Rule.** Paper carries thermal ink and print red, nothing else. Red appears only where money is lost or where the visitor should act; a red element that is neither is a defect.

**The Counter Stays Dark Rule.** The counter is never lightened and the strip is never darkened; there is no dark-mode inversion (`color-scheme: light`).

## Typography

**Display Font:** Martian Mono (with ui-monospace, monospace), self-hosted variable, weights 100–800, width 75–112.5%
**Body Font:** Commissioner (with system-ui, sans-serif), self-hosted, weights 400–700
**Label/Mono Font:** Martian Mono at narrow width (75%)

**Character:** Martian Mono is the receipt printer: wide and heavy for anything printed as a heading or total, narrow and regular for item lines. Commissioner is the quiet handwriting next to it, used only where the visitor reads sentences. All numbers are tabular.

### Hierarchy
- **Display** (800, wide, clamp 27–40px, 1.12): the h1, printed in double width under the masthead. Balanced wrapping.
- **Headline** (800, wide, clamp 20–27px, 1.12): section h2s between star rules. Inside two-column blocks it drops to clamp 19–22px.
- **Title** (700, wide, 18px): h3 inside a section or coupon.
- **Total** (800, wide, clamp 19–26px): receipt total lines and the post-beta price; thicker dot leader.
- **Receipt line** (400, narrow, 15px, uppercase; 12.5px under 560px): item lines with dot leaders. Small variant 13px in faded ink.
- **Body** (Commissioner 400, 17px/1.55, 16px under 560px, max 66ch): paragraphs, list items, FAQ answers. Lead paragraph 18px; muted notes 15px.
- **Label** (400, narrow, 12px, uppercase, 0.08em tracking): masthead subline and footer; masthead name 15px wide in thermal ink.
- **Button** (700, wide, 16px; 14.5px at normal width under 560px): printed buttons. The reprint key is 13px uppercase at normal width.

### Named Rules
**The Printer Voice Rule.** Anything the receipt would print (headings, item lines, totals, buttons, masthead, nav) is Martian Mono. Anything a person would read as a sentence is Commissioner. Never set a paragraph in mono or a total in sans.

**The Width Means Weight Rule.** Wide (112.5%) is reserved for headings, totals, buttons and the brand; item lines and labels stay narrow (75%). Width, not size alone, separates the levels.

## Layout

A single centred column: the strip is `max-width: 760px` with fluid inner padding (`strip-pad`), sitting 64px above the page bottom (48px on phones). Under 560px the strip runs full width minus 8px each side with 22px/18px padding. The counter nav shares the 760px width above it.

Content stacks in receipt order. Sections are separated by a starred cut rule (40px above, 34px below); sub-parts within a section by a dashed rule (18px each side). Item lines sit 3px apart. Two-column blocks (`fit / won't fit`, cross-sell notes) auto-fit at a 300px minimum with 24px/40px gaps and collapse to one column on phones. Numbered steps use a 3ch counter gutter separated by dashed rules.

Under 560px the nav hides every link except the red CTA (and the "Інструменти" anchor on the home page), so the action stays in the first viewport.

## Elevation & Depth

The strip is the only raised object: paper lying on the counter, with a soft ambient drop and a tight contact shadow. Nothing inside the strip is elevated; there are no cards, no hover lifts, no layered panels. Inner hierarchy comes from rules, width and ink.

### Shadow Vocabulary
- **Paper on counter** (`box-shadow: 0 22px 50px -18px rgba(0,0,0,.6), 0 2px 6px rgba(0,0,0,.35)`): the receipt strip only.

### Named Rules
**The One Paper Rule.** Exactly one surface casts a shadow: the strip. Coupons and blocks inside it are drawn with dashed borders, never lifted.

## Shapes

Square everything (0px radius): strip, buttons, coupons, nav CTA, loss stamp. The strip's only silhouette is the zigzag tear edge, a 14px repeating sawtooth (7px teeth, 10px tall) on top and bottom, drawn in paper colour. Strokes are dashed by default (1.5px rules, 1.5–2px coupon and key borders); solid 2px borders mark real buttons. Dot leaders (2px dotted, 3px on totals) connect labels to values. The favicon is the one rounded shape (6px on a 32px tile), an icon convention, not a system radius.

## Components

### Buttons
Printed, square and heavy.
- **Shape:** square (0px), 2px solid border.
- **Primary:** print red fill and border, paper text, Martian Mono 700 wide, 16px 22px padding. Used for the beta application on every occurrence.
- **Hover / Focus:** hover swaps to pressed red; active nudges down 1px; focus is a 2px red outline offset 3px. Transitions: transform .12s ease-out, background .15s.
- **Secondary:** paper fill, thermal-ink 2px border and text; hover fills pressed paper. Used for "Переглянути демо".
- **Rows:** paired buttons share a wrapping row, each `flex: 1 1 300px`, primary and secondary side by side, full width on phones.

### Reprint Key
A dashed-border, transparent key (1.5px dashed thermal ink, 44px min height, 13px uppercase mono at normal width) that reprints the demo receipt. Hover fills pressed paper.

### Coupon
A dashed 2px thermal-ink frame (18px padding, 12px on phones) that holds the primary action and its terms. Not a card: no fill change, no shadow, no radius.

### Navigation
A thin bar on the counter, 13px mono. Brand "PAVCRAFT" bold, wide, counter-light. Links counter-dim, brightening to counter-light on hover, no underline. The nav CTA is a small square red block (7px 12px, bold wide) that stays visible at every width.

### Receipt Line (signature)
Label, a flexible dot-leader fill, and a right-aligned non-wrapping value, uppercase narrow mono. Variants: **total** (wide 800, larger, 3px leader, red when negative), **small** (13px faded ink), **struck** (value struck through in 2px red, for loss).

### Masthead
The receipt's store header: centred, uppercase, product name 15px wide in thermal ink over a faded-ink 12px subline, followed by a dashed rule before the h1. It is a store header, not an eyebrow over the headline.

### Loss Stamp
Reverse print: paper text on a print-red block with 0.5ch side padding, bold. Used only for the ЗБИТОК verdict.

### Plain and Step Lists
List markers are printed characters from a `data-m` attribute ("+" in thermal ink, "−" in red). Numbered steps print "1." in wide 800 mono, rows divided by dashed rules.

### FAQ
`details` rows between dashed rules, bold mono summary with a printed "+" / "−" toggle; answers in faded-ink Commissioner.

### Print Animation (signature)
On load and on reprint, receipt lines print in sequence: each line fades from 12% opacity, 5px up and 1.5px blur to rest over .36s `cubic-bezier(.16,1,.3,1)`, staggered 70ms. Skipped under `prefers-reduced-motion` and when the tab is hidden; added only by script so no-JS shows the finished receipt.

## Do's and Don'ts

### Do:
- **Do** put all content on one centred paper strip (max 760px) on the graphite counter, with zigzag tear edges top and bottom.
- **Do** keep red for loss and the primary action only; mark loss by texture too (strike-through, reverse-printed stamp), not by colour alone.
- **Do** print figures as receipt lines with dot leaders and tabular numbers; totals go wide and heavy.
- **Do** separate sections with the starred cut rule and sub-parts with the dashed rule.
- **Do** set paragraphs in Commissioner at 17px (16px on phones), max 66ch.
- **Do** keep the beta CTA reachable in the first viewport on a 390px phone via the red nav button.

### Don't:
- **Don't** use a split hero (copy left, screenshot right) or a row of feature cards.
- **Don't** round corners or lift inner blocks with shadows; the strip is the only shadowed surface.
- **Don't** introduce a third ink colour or use red decoratively.
- **Don't** set paragraph prose in Martian Mono.
- **Don't** restyle the masthead as an eyebrow or kicker above the headline.
