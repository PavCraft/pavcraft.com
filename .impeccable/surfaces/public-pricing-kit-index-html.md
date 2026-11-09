---
version: 1
slug: "public-pricing-kit-index-html"
primary_target: "public/pricing-kit/index.html"
related_targets: ["public/index.html"]
---

# Surface brief: Pricing Kit landing (/pricing-kit/) and pavcraft.com home

Mode: Persuade. Audience: Prom seller (ФОП, 100+ products, not a formula person), arriving from Telegram chats, mostly on a phone. Action now: apply for beta by email; later: trial / buy. Proof: demo sheet (fictional, labelled), official commission table, sources sheet. Constraints: PRODUCT.md capabilities; no unverified claims (CSV import not verified).

## Direction contract

THESIS: The margin of a product is a receipt: price minus purchase, Prom commission and other costs, total printed at the bottom, red when it is a loss. The page refuses the split hero (copy left, screenshot right) and the row of feature cards.

OWN-WORLD: Dark graphite shop counter (#1B1A18) under one long strip of thermal paper (#F6F4EE) with zigzag tear edges; faded thermal ink (#1E1E1C), secondary ink grey (#4F4B44), second print colour red (#C8231A, pressed #9E1A13) only for loss and the primary action. Martian Mono, wide bold, for printed headings, receipt lines, buttons and the masthead; Commissioner for paragraph text (adaptation 2026-11-09: a UX read on a 390px phone found monospace paragraphs tiring; PRODUCT principle 3). Dashed rules, item lines with dot leaders, totals in double width, top and bottom zigzag tear edges, loss verdict reverse-printed (paper on red).

STORY: The visitor sees one of their own kind of products printed as a receipt that ends in minus, understands that markup is not profit, sees what the table counts and how in five steps, believes it because limits and sources are printed on the same receipt, and applies for beta.

FIRST VIEWPORT: Counter with a thin nav. One receipt strip centred (max 760px desktop, full width minus 12px on phones) starting at the top: masthead "PRICING KIT / Google-таблиця для продавців Prom" (receipt store header, centred, separated from the h1 by a dashed rule; never restyle it as an eyebrow), printed headline in double width "Ваш товар продається в мінус. Ось чек.", then a demo product receipt (price, purchase, commission, other costs, total in red, margin, new price), a "Пробити інший товар" control, and the primary action "Подати заявку на бета-тест" as a red printed coupon at the bottom of the viewport. Adaptation 2026-11-09: a red "Подати заявку" button sits in the counter nav so the action is in the first viewport on a 390px phone (phone-first audience), where the coupon falls below the fold.

FORM: Fiscal receipt as the page carrier, the pick card (my top-ranked grounded candidate, position 2 of 7). seed:1392104ab0ef4556. Raises kept from the round: products ranked by severity; state changes texture (loss lines struck and red), not only colour.

SIGNATURE: The receipt prints line by line on load (short, ease-out, skipped under reduced motion), and "Пробити інший товар" reprints it for three real demo products: loss, below target, OK.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
