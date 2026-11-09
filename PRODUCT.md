# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Home page: owners of small businesses in Ukraine who run things themselves (sole proprietors, marketplace sellers, service masters) and lose time on manual routine. Pricing Kit page:

Owners of small and mid-size shops on Prom.ua (some also sell on Rozetka, Epicentr or their own site). Usually a sole proprietor (ФОП 2 or 3 group) with 100+ products on a paid Prom package. They set prices from the purchase price plus a markup and are not comfortable with spreadsheet formulas. They arrive from Telegram chats and Facebook groups of sellers, most often on a phone. (Confirmed 2026-11-09.)

## Product Purpose
pavcraft.com is the home of Pavcraft, an independent Ukrainian developer of tools that remove manual routine for marketplace sellers. The first product is Pricing Kit: a Google Sheets template that shows which Prom products sell at a loss or below the seller's target margin, calculates the minimum and recommended price for each product, and prepares a CSV with new prices for import back into the Prom cabinet. Success now: beta applications, then first sales at 990 UAH one-time.

Site structure: the home page is the Pavcraft brand catalogue for small business in Ukraine (in Ukrainian); its job is to route each visitor to the tool for their field. Tools will span different fields (marketplace sellers, service masters with online booking, and others), so the home page needs a field-neutral brand world. Each product page has its own visual world fitted to its audience; the first is /pricing-kit/ (fiscal receipt, recorded in design/pricing-kit/DESIGN.md). The receipt world must not be reused for the home page or other products. (Confirmed 2026-11-09; replaces the earlier "one shared visual system" answer.)

## Positioning
Pricing Kit calculates the seller's real net margin per product, for the whole assortment at once (up to 5,000 products), using the official Prom commission for each of 4,339 categories plus Ukrainian taxes (ФОП, ЄСВ, military levy), acquiring, cash on delivery, delivery, returns, package fee and ads, and closes the loop with a file the Prom cabinet imports. It lives in the seller's own Google Drive; no external services.

## Operating Context
- Seller exports products from the Prom cabinet (Товари → Експорт → XLSX), pastes into the sheet, adds purchase prices, reads statuses, downloads CSV, imports it in the cabinet (Товари → Імпорт, only «Ціна», «Тільки оновлення»).
- Statuses: ЗБИТОК / НИЖЧЕ ЦІЛІ / ОК / НЕМАЄ ЗАКУПІВЛІ / НЕМАЄ СТАВКИ / НЕМАЄ ЦІНИ.
- Public demo sheet with 5,000 fictional products (view only).
- Free trial copy limited to the first 20 products.

## Capabilities and Constraints
- Static HTML/CSS site, repo PavCraft/pavcraft.com, Cloudflare static assets, auto-deploy from main.
- Customer-facing language: Ukrainian, no russisms. Brand name stays Latin "Pavcraft".
- Current mode: beta. Applications and purchases go by email (pav.craft.lab@gmail.com); no payment provider yet. Purchase block exists but is hidden until payment details are set.
- No refunds; instead a free 20-product trial and free support. Rate updates sent by email. Replies within an hour, daily 9:00–21:00.
- Not in scope, never promise: competitor price monitoring, review collection, currency prices, discounts, more than 5,000 products, accounting/tax advice.
- CSV import into a live Prom cabinet is not yet verified (beta goal); do not claim it works.

## Brand Commitments
- Name: Pavcraft. Everything else in the old look (colors, fonts, gold "P" icon) may be replaced. (Confirmed 2026-11-09.)
- Voice: concrete, honest about limits, seller-to-seller, on «ви», first person singular for the developer («я»).

## Evidence on Hand
- Product facts: D:\MyScripts\pricing-kit\docs\product-facts.md
- Demo numbers (fictional, must be labelled «демо»): 5,000 products, 1,694 at a loss, 2,420 below target, 886 OK, average margin 6.4%.
- No customers, sales, reviews or testimonials yet. Never fabricate them.

## Product Principles
1. Show the seller's own loss, then the fix: every page leads to "see where you lose money" and "get prices that don't".
2. Honesty is the trust signal: state limits and what is unverified next to the claims.
3. Built for a non-technical seller on a phone: plain words, paths from the Prom cabinet, no jargon without explanation.
4. One clear next action per state (beta application now, trial and purchase later).
