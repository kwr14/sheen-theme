> Theme for www.sheenupholstery.com (Shopify, vintage Impulse). Branch `main` is the live theme **sheen-theme/main**; `staging` is **sheen-theme/staging**. Make changes on `staging`, check the preview, then open a PR into `main`. Back-office scripts live in [kwr14/sheen-backoffice](https://github.com/kwr14/sheen-backoffice).

# Sheen furniture pages: how it works (updated 12 Oct 2026)

Made-to-order furniture (sofas, armchairs, headboards) on the Shopify store, following Developer Brief v3. Customers:
1. pick a fabric **family**,
2. pick a **colour**,
3. pick a **size** (only shown when there's more than one),
4. then **add to basket** or **order a swatch**.

The detailed guides are in the project folder:
- `agents/README.md`: everyday use (spreadsheets, sync, photos, going-live checklist)
- `furniture-theme/README.md`: what the theme files do and their settings

## The pieces

| Part | Where | Notes |
|---|---|---|
| Fabric library | Shopify → Settings → Custom data → Metaobjects → **Fabric colour** (`fabric_colour`) | 66 colours in 11 families, all *Not yet approved*. Each colour has a price tier (Core / Premium / Designer) and a stock status (Not yet approved / Live / Temporarily unavailable / Discontinued). Purchasing edits colours here. Source: `Sheen_Furniture_Fabric_Library.xlsx`. |
| Pieces | Products tagged `furniture`, theme template `furniture` | Variants are **Size × Fabric tier**. Product field `custom.fabrics` lists the colours offered. |
| Pricing | `agents/furniture/tiers.csv` + `pieces.csv` | price = size frame + size metres × tier £/m. **Draft** tier figures: Core £30, Premium £45, Designer £65. |
| Swatches | Product "Fabric swatch" (`furniture-fabric-swatch`) | Draft, placeholder £3.00. The button shows only when this product is published and the chosen colour is Live. |
| Product page | `sections/furniture-configurator.liquid` | Family tabs → colour chips → fabric card → size → price breakdown → basket / swatch. Basket lines carry Fabric, Supplier code and Swatch SKU. Photos with alt text `#<supplier code> <View>` belong to that colour. |
| Landing page | `/pages/furniture`, `sections/furniture-landing.liquid` | One card per product type; counts Live colours. |
| Automation | `agents/furniture_agent.py` (`status`, `fabrics`, `sync`, `theme`, `page`, `all`) | Dry run unless `--apply`. Reads the fabric library; never edits it. |

Which colours customers see:
- **Live**: shown and selectable.
- **Temporarily unavailable**: shown greyed out.
- **Discontinued**: hidden.
- **Not yet approved**: hidden, except in the theme editor or on products tagged `fabric-preview` (`preview_fabrics = yes` in `pieces.csv`).

The theme is "vintage" Impulse, so templates are `.liquid` files that load the sections. JSON templates don't work.

## Status (11 Oct 2026)

**Live**
- The theme "Impulse – Furniture preview" (178813043064) was **published** on 11 Oct at 20:04 UTC and is now the live theme.
- Public domain: **www.sheenupholstery.com**. (`sheenupholstery.co.uk` returns a bare "Not Found".)
- `/pages/furniture` is live and shows "Furniture is coming soon", because every piece is still a draft.
- The theme copy was taken on 26 Sep. Any edits made to the old Impulse after that date are not in it.

**Pieces**
- All four were set to **ACTIVE** and published to the Online Store on 11 Oct, as a **showcase**.
  - Customers can browse the fabric families and colours.
  - The price reads "Coming soon", the button reads "Coming soon" and is disabled, and an "Ordering opens soon" note is shown.
  - Placeholder descriptions, specs and "[X–Y weeks]" lead times were removed.
- Draft prices, hidden until a colour is Live:

  | Piece | Core | Premium | Designer |
  |---|---|---|---|
  | Three-seat sofa | £1,870 | £2,080 | £2,360 |
  | Armchair | £830 | £920 | £1,040 |
  | Headboard (double) | £410 | £455 | £515 |
  | Dexter Sofa | £7,350 | £7,350 | £7,350 |

- The landing page shows one card per type: Dexter, Headboard, Armchair. The three-seat sofa is reachable from its own address but has no card.
- **How the showcase works.** These two settings make the unapproved colours visible to customers (they can't be bought):
  - the configurator setting "Show unapproved fabrics (showcase)" is **on**;
  - the products are tagged `fabric-preview`.

  Prices and the "Coming soon" texts switch automatically once any colour is Live. Theme settings under "Before ordering opens" control the texts and an option to show prices early.

**Menu**
- **Hidden again since 12 Oct.** The live header uses the original "Main menu" (no Product item) until the products are finalised. To bring Product back: theme editor → Header → Navigation → "Main menu (with Products)" → Save. Shopify commits that change to GitHub automatically.
- Was live 11–12 Oct. The header now uses "Main menu (with Products)" (handle `main-menu-products`), set in theme editor → Header → Navigation.
- It's a copy of the old main menu plus a top-level **Product** item linking to `/pages/furniture`, with Sofas → Dexter Sofa, Armchairs → Armchair and Headboards → Headboard.
- Edit this menu from now on, not "Main menu".
- The dropdown links now open the showcase product pages.

**Agent**
- Rewritten for the fabric library on 11 Oct.
- `status` against the store shows all four pieces in sync.
- Custom fields are saved with `metafieldsSet`. Never send `metafields` inside `productSet`: it deletes every product field not listed.

## Before launch
1. Confirm the tier £/m (`tiers.csv`) and Dexter's fabric metres.
2. Mark colours Live and add swatch photos (`furniture_agent.py fabrics` lists what's missing).
3. Add real photos, specs and lead times, and set shipping weights (currently 0).
4. Confirm Dexter's name, description and photos are Sheen's own. Its spec used to say "Source | Kingcome sofas collection"; that line was removed on 11 Oct.
5. When opening for orders:
   - mark colours Live;
   - turn off "Show unapproved fabrics (showcase)";
   - set `preview_fabrics` to `no` in `pieces.csv`, then run `sync --apply`.
6. Publish and price the Fabric swatch product.

## Fabric library tidy-up (12 Oct 2026)
- **Collection** now holds only the customer-facing name: Elba, Linara, Davey, Smooth III, Omega IV, Atlantis, Teddy FR, Kobi. The supplier and range notes that used to be in brackets were moved to **internal_note** ("Collection note (moved 12 Oct): …").
- **Composition** no longer says "TBC". Partial values were kept, e.g. "Wool" and "Cotton-linen". Where nothing was known, the field is now empty, so the fabric card shows no composition line. The original wording is in internal_note ("Composition to confirm (was: …)").
- Checked on all four live product pages: no "TBC", no supplier notes, and internal notes are not on the page.
- **Still to decide (purchasing):**
  - Placeholder colour names: Commercial Texture "Colour 1–6", "Sage / olive", "Ivory / cream", "Teal / blue", "Warm neutral" ×2, "Warm accent".
  - 37 colours have no supplier code, all with verification "To choose".
  - Shared placeholder chip colours: for example, #9C8B7A and #C9C2B6 are each used by 6 colours. The chip colour also drives the illustration.
  - Empty composition for Petrus, Smooth III and Kobi.

## Theme version control (GitHub), set up 12 Oct 2026
- Repository: **github.com/kwr14/sheen-theme** (private). It holds the full theme (532 files), snapshotted from the live theme on 12 Oct.
- Branches are connected to Shopify themes through the Shopify GitHub app:
  - `main` → theme **sheen-theme/main** (178888114552)
  - `staging` → theme **sheen-theme/staging** (178888147320)
- The 12 Oct check confirmed `main` matches the live theme "Impulse – Furniture preview" (178813043064). 524 files are byte-identical; 8 differ only in line endings or spacing.
- **Live since 12 Oct 2026, 12:28:** `sheen-theme/main` (178888114552) is the published theme. The previous theme, "Impulse – Furniture preview" (178813043064), stays unpublished as a fallback.
- **Workflow after that:**
  1. Changes are committed to `staging` and checked in the staging theme's preview.
  2. Merging into `main` updates the live site.
  3. Edits saved in the theme editor or code editor on a connected theme are committed back to its branch by Shopify automatically.
  4. Roll back by reverting a commit.
- **Access:**
  - Push access uses a fine-grained token in `agents/config.env` (`GITHUB_TOKEN`), limited to sheen-theme with Contents read/write. Claude never handles this token.
  - `push_theme.sh` did the first push.
  - Claude sessions with `kwr14/sheen-theme` attached can commit directly.
- `furniture_agent.py theme` (direct theme upload) is no longer needed for the connected themes. Once `main` is live, don't upload to the live theme outside GitHub, or the branch and the theme will drift apart.

## Colour illustration (12 Oct 2026, on staging)
- When a colour has no photos of its own, the product page draws an illustration of the piece in that colour.
  - The shape follows the product type: sofa, armchair, headboard or footstool.
  - A texture hint follows the fabric family: weave for linen/cotton, sheen for velvet/chenille, loops for bouclé, zigzag for herringbone, diagonal for twill.
  - It's the first view, labelled "Your colour", with the note "Illustration · colour is indicative". The product photos follow it, labelled "Shown in a sample fabric".
- **Files:**
  - `assets/furniture-illustration.js` (new)
  - `sections/furniture-configurator.liquid` (new settings: Show an illustration in the chosen colour, Illustration view name, Label on the illustration)
- **Colour source:** each colour's `chip_colour`. Better swatch colours make better illustrations. Once photos tagged `#CODE View` exist for a colour, they replace the illustration automatically.
- **Status:** live since 12 Oct 2026, through PR #1 (staging → main) on GitHub. Checked on all four product pages with no errors.

