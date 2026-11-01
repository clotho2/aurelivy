# Aurel & Ivy — Shopify theme

The aurelivy.com storefront: Shopify's **Dawn 16.1.0** theme with Aurel & Ivy's colors, fonts and
a few custom sections. Shopify's GitHub integration keeps this repository and the store in sync.

## How changes reach the store

- `main` is connected to the store theme. Anything merged into `main` shows up in that theme
  within a minute or two.
- Shopify syncs both ways: when you change something in **Online Store → Themes → Customize**,
  Shopify commits that change back to `main`.
- New work happens on a separate branch. To preview a branch before merging, go to **Online Store →
  Themes → Add theme → Connect from GitHub**, pick this repo and the branch. It appears as an
  unpublished theme you can preview and customize.
- While a branch is waiting to be merged, avoid editing the homepage in the Customize screen of
  the `main` theme. Both changes would touch `templates/index.json` and conflict.

## What's custom

Every custom file starts with `ai-` so it's easy to tell apart from Dawn's own files.

| File | What it does | Where you edit it |
| --- | --- | --- |
| `sections/ai-holiday-hero.liquid` | Homepage hero with the Vault offer and a live countdown to the Dec 12 cutoff. Switches to the gift-card message by itself when the cutoff passes. | Customize → Home page → A&I Holiday Hero |
| `sections/ai-gift-box-builder.liquid` | "Build your gift box": pick items, see the 15% / 25% tiers, add the real products to the cart. **Hidden from shoppers until a collection with products is picked.** | Customize → Home page → A&I Gift Box Builder |
| `sections/ai-ingredient-spotlight.liquid` | Tabs for bakuchiol, vegan peptides, hyaluronic acid and sea-buckthorn. | Customize → Home page → A&I Ingredient Spotlight |
| `sections/ai-comparison-table.liquid` | "Why bio-active vegan, not synthetic retinol" table. Stacks into cards on phones. | Customize → Home page → A&I Comparison Table |
| `snippets/ai-delivery-promise.liquid` + `assets/ai-delivery-promise.js` | Product page line under Add to cart: "Order today, arrives Tue, Nov 24 – Mon, Nov 30", plus the Christmas cutoff. Calculated in US Eastern time, skipping weekends and the listed holidays. | Theme settings → Aurel & Ivy |
| `snippets/ai-free-shipping-meter.liquid` | Cart drawer and cart page: "You're $X away from complimentary gift shipping." | Theme settings → Aurel & Ivy |
| `assets/ai-theme.css` | Styles for the meter. | — |

Small changes to Dawn's own files: `layout/theme.liquid` loads `ai-theme.css` and a semibold
Cormorant weight; `snippets/cart-drawer.liquid` and `sections/main-cart-footer.liquid` show the
free-shipping meter; `config/settings_schema.json` adds the **Aurel & Ivy** settings group.

### Theme settings → Aurel & Ivy

- **Free shipping threshold** (default $100). Must match your free shipping rate in Settings →
  Shipping and delivery.
- **Earliest / latest arrival** in business days after the order (default 4 and 7).
- **Holiday order cutoff** (default `2026-12-12T23:59:00-05:00`) and its wording.
- **Non-shipping days** skipped in the estimate (Thanksgiving, Christmas, New Year's Day).
- **Digital gift card product**, linked after the cutoff.

## Pages and templates

- **Homepage** (`templates/index.json`), top to bottom:
  1. Holiday hero
  2. Trust bar
  3. "Inside the Holiday Vault" products
  4. Comparison table
  5. Ingredient spotlight
  6. 3-step evening ritual
  7. Overnight Bakuchiol Duo
  8. Founder note
  9. Gift box builder
  10. FAQ
  11. Black Friday early-access sign-up (the announcement bar links here with `/#vip`)
- **Product pages** (`templates/product.json`): the delivery promise under Add to cart, plus tabs
  for Shipping & delivery, the 30-Night Ritual Promise, and Vegan, safety & patch test. The vendor
  line is removed so the supplier's name never shows.
- **FAQ page** (`templates/page.faq.json`): in Admin go to Online Store → Pages → Add page, title
  it "FAQ", choose the template **page.faq**, and add it to the footer menu.

## To finish once products are in the store

These need products, collections or Admin settings, so they can't be done in code alone:

1. Push the 4 products from the Selfnamed app. Don't create them by hand, or orders won't route to
   Selfnamed.
2. Create a manual collection **Gift Box Builder** with only the 4 singles (no bundles, no gift
   product).
3. In Customize, on the homepage:
   - **Hero:** add the image, pick the Vault under "Pull price from product," and link the
     after-cutoff button to the gift card.
   - **Inside the Holiday Vault:** change the collection from "All" to Gift Box Builder.
   - **Duo:** add the image and link the button to the Duo product.
   - **Founder note:** add a photo.
   - **Ingredient spotlight:** add 4 portrait images and pick the "Found in" products.
   - **Builder:** pick the collection and the free-gift product.
4. Theme settings → Aurel & Ivy: set the digital gift card product.
5. Create the discounts in Admin → Discounts:

| Discount | Type | Settings | Combines with | Active |
| --- | --- | --- | --- | --- |
| Gift Box 15% | Automatic, amount off products | 15% off the Gift Box Builder collection; minimum 2 items | Nothing | Nov 20 – Jan 31 |
| Gift Box 25% | Automatic, amount off products | 25% off the same collection; minimum 3 items | Product discounts | Nov 20 – Jan 31 |
| Free Holiday Gift Box | Automatic, buy X get Y | Buy 3+ from the collection; get the gift product free; max 1 use per order | Product discounts | Nov 20 – Dec 31 |
| VIP Vault | Code `VIPVAULT`, amount off products | $20 off the Vault; one use per customer | Nothing | Nov 20 – Nov 25 |
| Black Friday Vault | Automatic, amount off products | $20 off the Vault | Nothing | Nov 26, 6 pm ET – Nov 30, 11:59 pm ET |

**Test order (Nov 13):**
- 2 singles → 15% off.
- 3 singles → 25% off plus a free gift.
- Vault + 1 single → no gift-box discount.
- Check whether Shopify adds the free gift by itself. If it does, the builder's own "add gift"
  step would add a second one, so remove that step.
- Also check that the gift is charged if the box drops below 3 items. The builder's fine print
  warns shoppers about this.

## Date checklist

| Date | Change |
| --- | --- |
| Nov 16 | Remove the store password. Announcement bar is already set: "Black Friday early access opens Nov 20" + free shipping. |
| Nov 20 | Hero promo badge → "VIP early access: $175". Announcement 1 → "VIP early access is open: the Holiday Vault, $175 (a $292 value)". Announcement 2 → "Arrives in 4–7 business days. Order by Dec 12 for Christmas." Newsletter heading → "First access to restocks and new rituals." |
| Nov 26 (6 pm ET) | Hero promo → "Black Friday: $175". Announcement 1 → "Black Friday: the Holiday Vault, $175. Ends Cyber Monday at midnight." |
| Dec 1 | Hero promo → "Gift-ready". Announcement 1 → "Order by Dec 12 for Christmas delivery". Announcement 2 → "Build your gift box: 2 saves 15%, 3 saves 25%". |
| Dec 13 | Nothing to do in the hero; it switches to the gift-card message on its own. Announcement 1 → "Too late to ship? Give a digital gift card, delivered instantly." |
| Dec 26 | Theme settings → Aurel & Ivy: clear the holiday cutoff. The product page then shows only the arrival estimate. |

## Copy rules

Every claim is about how skin **looks or feels** (FDA cosmetic rules). See the claim cheat sheet in
the launch plan. Don't add "never tested on animals" until Selfnamed confirms it in writing, and
keep "Ships from the US" (not "our US studio"). The products are made in the EU, so never imply
"Made in USA."

## Checks

Run Theme Check before merging:

```bash
npx @shopify/cli@3 theme check --path .
```
