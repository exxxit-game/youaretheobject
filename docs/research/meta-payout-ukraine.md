# Meta Horizon Store payouts for a solo developer in Ukraine

Question: can a solo developer in Ukraine (Meta developer organization "Exxxit", no app yet) receive
payouts from paid apps and in-app purchases on the Meta Horizon Store? Checked 2026-10-10.
Every claim has its link and a short quote. "not confirmed" = no source found for it.

## Findings (appended as found)

1. Meta Financial FAQs, https://developers.meta.com/horizon/faqs/financial-faq
   - Minimum: "you must have met a $100 threshold from the previous month"; below it, revenue
     "will carry over to the following month".
   - Schedule: "your payout should be initiated by the middle of the following month".
   - Tax forms: "Meta requests a W-8 or W-9 form"; "Meta does not withhold any developer income tax";
     "Developers need to report their income tax themselves."
   - Outside the US and Canada: "If you reside outside of the US or Canada, Facebook Technologies
     Ireland Limited is the business entity" doing the transaction; "If you are an international
     entity, however, your contract might still be with Facebook Technologies, LLC."
   - This page does NOT list payout countries or methods, and does not mention Ukraine.

2. Meta "Manage your financial account" (last updated 2026-05-13),
   https://developers.meta.com/horizon/resources/publish-account-management-bank-tax/
   - Where to set it up: Developer Dashboard https://developers.meta.com/horizon/manage/ , the
     "Team" dropdown, "Payment Information", then "Add Payment Information".
   - Asks for "country and business type" and the "Name, address, and date of birth of the legal
     owner for the business". The page does not list the business types or the allowed countries.
   - Bank: personal or business account allowed, but "the name on the bank account must match the
     name on your developer account"; IBAN with the right country prefix; SWIFT/BIC for
     international transfers.
   - Currency: "All payments will be made in USD, regardless of local currency."
   - Tax: W-8 or W-9 at setup; for treaty benefits, foreign tax ID plus W-8BEN (line 9) or
     W-8BEN-E (lines 14a and 14b); "Failure to properly complete these forms may result in US
     withholding tax being applied to your payout." Tax details: "Changes after the fact are not possible."
   - No country list, no sanctions wording, no mention of Ukraine on this page.
   - Contact: "Get Developer Support" form https://developers.meta.com/horizon/contact/ , issue
     category "Payments & Payouts".
   - Not described on the page: ID document verification (not confirmed either way).

3. Meta Horizon Developer Distribution Agreement (effective May 9, 2025),
   https://developers.meta.com/horizon/policy/developer-distribution-agreement/
   - 1.17: the "Territory" is worldwide; no country-based developer eligibility list in the text.
   - 5.1(a): Meta remits "seventy percent (70%) of the Net Revenues".
   - 5.3: paid "on a monthly basis within thirty (30) days after the end of each month"; nothing is
     paid for a month under USD $100 (it carries forward); the developer pays bank fees.
   - 5.4(b): withholding tax, if any, is "solely for Developer's account".
   - 14.12 Trade Compliance: the developer warrants it "is not subject to any applicable UN, US, UK
     or EU economic sanctions"; Meta may terminate on breach.
   - The words Ukraine, Crimea, occupied territories and OFAC do not appear in the agreement.
   - So: no document found that excludes Ukraine, and none that names it as supported (not confirmed
     either way). The definitive list is the country dropdown in the dashboard's "Add Payment
     Information" flow, behind the owner's login.

4. IRS "Table 1. Tax Rates on Income Other Than Personal Service Income..." (Rev. May 2023),
   https://www.irs.gov/pub/irs-lbi/tax-treaty-table-1.pdf ; treaty text https://www.irs.gov/pub/irs-trty/ukrain.pdf
   - Ukraine row (code UP): royalties 10 (industrial/know-how), 10 (patents), 10 (film & TV),
     10 (copyrights), treaty article citation 12(2); the statutory rate without the treaty is 30.
   - Not confirmed: whether Meta treats store sales as royalties at all. Meta's FAQ says "Meta does
     not withhold any developer income tax" (source 1), while its setup page warns that a badly
     completed W-8 "may result in US withholding tax being applied to your payout" (source 2).
     For an individual sole proprietor the form would be W-8BEN, for a company W-8BEN-E (form
     choice by entity type is general IRS practice; Meta's page names both without saying which).

5. OFAC FAQ 1006, "What does Executive Order (E.O.) 14065 do?", https://ofac.treasury.gov/faqs/1006
   - Covered Regions: "the so-called Donetsk People's Republic and Luhansk People's Republic regions
     of Ukraine", plus regions the Treasury Secretary may add. Prohibited for US persons include
     imports of services or technology from them and "new investment" there.
   - Crimea is a separate blocked jurisdiction under E.O. 13685 (OFAC programme page
     https://ofac.treasury.gov/sanctions-programs-and-country-information/ukraine-russia-related-sanctions ;
     seen in a search result, page not opened: unverified wording).
   - The rest of Ukraine: FAQ 1006 does not restrict it. Whether Meta blocks a developer for living
     or banking in a covered region is not confirmed: Meta's agreement 14.12 asks only that the
     developer is "not subject to any applicable UN, US, UK or EU economic sanctions", and no Meta
     page found ties payouts to residence or the bank's region.

6. The dashboard itself, 2026-10-10 16:55 UTC (the owner's phone screenshot, kept as
   objekt-files\notes\meta-payout-countries-2026-10-10.jpg): "Add Payment Information", step 1 of 5,
   "Country" list: Ukraine is in it. Nothing was filled in or submitted. The organisation selected at the
   top was not the one this file names; which organisation the game belongs to is asked of the owner.
   Next to see (still without submitting): the business types offered for Ukraine.

## Not confirmed / not found
- A Meta page naming Ukraine (the dashboard list does, item 6); whether a payout actually arrives (first payout).
- Payout methods other than bank transfer (PayPal, Payoneer): no Meta page found mentions them.
- ID document verification step: not on Meta's setup page.
- Rules for the temporarily occupied territories: not in Meta's agreement text; only the general
  sanctions warranty in 14.12.
- Whether a solo person (no company) can pick an "individual / sole proprietor" business type:
  the setup page says "country and business type" but not the options; seen only in the dashboard.

## For the owner (behind his login)
- https://developers.meta.com/horizon/manage/ : Team, then "Payment Information", then
  "Add Payment Information": see whether Ukraine is in the country list and which business types it offers.
- https://developers.meta.com/horizon/contact/ : "Get Developer Support", category
  "Payments & Payouts", to ask Meta directly.

## Next
- Private person or FOP, the tax form and the bank for these payouts: docs/research/meta-payout-ukraine-2.md.
