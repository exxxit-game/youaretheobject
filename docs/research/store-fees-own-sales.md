# Store fees and selling paid content ourselves (2026)

The owner's question, 10 Oct 2026: the game free in every store that takes it, paid content sold with the
smallest legal commission, ideally straight to us, never breaking a store's rule. Context: a WebXR site
(youaretheobject.com) packaged for Meta's Horizon Store as a TWA (docs/research/revision-1-store.md); payouts to
Ukraine (docs/research/meta-payout-ukraine.md, -2.md); the owner is a private individual (no FOP). Every claim has
its link, the page date where shown and a short quote; "not confirmed" = no source found; "(my reading)" = my
inference. Not legal or tax advice. The paper library has nothing on this topic (grep: no hits).

## The answer in short
- Inside a store app the store's rules decide, and Meta's are strict: an app on the Horizon Store with in-app
  purchases "must use the Platform In-App Purchases" (70% to us). No Meta exception covers a game, and nothing in
  Meta's public terms lets the Store app link to the web or unlock floors bought on our site. Only a written yes
  from Meta could change that (Distribution Agreement 4.5).
- Outside every store the site is ours: in the Quest Browser, youaretheobject.com can sell floors through a
  merchant of record. Paddle takes 5% + 50¢ ($9.00 of $10 kept), names only five occupied regions of Ukraine as
  unsupported, signs individuals and pays by wire or Payoneer. Stripe does not serve Ukraine. LiqPay needs a FOP.
- Google Play lets a free app be "consumption-only" (no purchases inside, content bought on the web unlocked by
  login). Steam lets us sell Steam keys on our own site and takes nothing on them. Apple forbids license keys
  (3.1.1) and refuses a "repackaged website" (4.2), so it is web only for us.

## Parts
1. Each store: the fee on digital goods (and any small-developer rate); whether an app may (a) sell through its
   own web payment, (b) link or point to the web (US court orders, EU DMA, Japan, Korea), (c) unlock content
   bought elsewhere, (d) be free with everything unlocked by a code or account from our site. 1.1 Meta Horizon
   Store (PWA/TWA), 1.2 PICO, 1.3 Steam, 1.4 Google Play / Android XR, 1.5 Apple / visionOS, 1.6 SideQuest,
   1.7 itch.io, 1.8 web-app stores, 1.9 the regional exceptions together.
2. Our own site: payment providers for a seller resident in Ukraine; fees, taxes handled, payout to Ukraine.
3. A $10 sale worked through each route. 4. Verdict table; what Meta, the providers or a lawyer must confirm.

## 1.1 Meta Horizon Store (the TWA/PWA listing included)
- Distribution Agreement, "Effective Date: May 9, 2025",
  https://developers.meta.com/horizon/policy/developer-distribution-agreement/ (read 10.10): 5.1(a) Meta retains
  "thirty percent (30%) of the Net Revenues" and remits "seventy percent (70%)"; subscriptions from month 4: Meta
  retains "fifteen percent (15%)". No small-developer or web/PWA rate in the text. 1.10: Net Revenues are gross
  "less (a) applicable taxes, (b) sales processing costs or fees", refunds and chargebacks. 4.5: "Developer may
  only implement in-Product purchases ... using the means that are (a) approved in a writing by MPT or its
  Affiliate to Developer or (b) approved in publicly available Terms and Policies." No price-parity clause found;
  the licence to Meta is "non-exclusive".
- App policies, "Updated : Mar 10, 2026", https://developers.meta.com/horizon/policy/app-policies/ (read):
  1.1.1 "if your app has in-app purchases, and your app is distributed through any Meta Platforms Technologies
  distribution channel, including the Meta Horizon Store, you must use the Platform In-App Purchases".
  1.1.2 exceptions only: "Developers may sell licenses for prepaid in-app functionality off-platform only when
  selling such licenses in bulk to business customers (such as companies or educational institutions)"; and
  "Windows into an Existing Service" may sell off-platform, which 4.1.1 limits to "non-interactive media content"
  with "limited interactivity" (a game is not one: my reading). 3.3.3 not allowed: "Intentionally using linking
  to ... circumvent any Meta policies, including Meta's Payments policy". 1.2.1: Keys and promo codes give "a
  limited number of users an entitlement".
- Keys, "Distribution options", "Updated : Mar 23, 2026", https://developers.meta.com/horizon/policy/distribution-options/
  (read): Keys unlock the app "or in-app purchase items"; "You may generate 2000 Keys every 6 months"; "you can
  distribute Keys yourself or through other websites. You must follow the App Policies on Promotional Mechanisms";
  Meta "may ... charge a fee for Keys". Selling Keys to players as a sales channel: neither allowed nor forbidden in
  words: not confirmed (ask Meta).
- A fee change or small-developer rate in 2025-2026: not found ("Monetization overview", "Updated : May 11, 2026",
  https://developers.meta.com/horizon/resources/monetization/, and the GDC 2026 post
  https://developers.meta.com/horizon/blog/gdc-2026-state-of-vr/, both read: no rate change).
- So for Meta (my reading): (a) no; (b) no allowance found, and 3.3.3 bars steering links; (c) no reader or
  cross-platform exception for games; (d) no for single players (an off-platform sale of in-app content); yes only
  for bulk licences to schools and companies (1.1.2). No US or EU rule found that opens this (see 1.9).

## 1.2 PICO Store
- PICO developer terms, "Last Updated: December 12, 2024", https://developer.picoxr.com/terms/ (read): the app may
  be "free or on a paid basis"; "The Parties agree to enter into separate agreements if you decide to ... offer
  your app on a paid basis"; PICO is "entitled to collect and receive ... all payments made by End Users". No
  percentage in the public terms.
- The fee and the rules on outside payment, links or codes: not confirmed. PICO names a "PICO Developer Product
  Distribution Agreement" and "PICO Store Review Guidelines"
  (https://developer.picoxr.com/document/distribute/app-distribution-overview/), whose body rendered neither by
  curl nor in the browser pane (menu only). Payments for a PWA listed by URL: not found.

## 1.3 Steam (desktop wrapper; Steam Frame)
- Fee: Valve's own text (the Steam Distribution Agreement, partner login) not read; the 2018 announcement
  (https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838) did not render. Press
  (https://www.pcgamesn.com/steam-revenue-split-big-games, search result only): 75/25 "on earnings beyond $10M",
  80/20 beyond $50M. The 30% base: not confirmed from Valve.
- "Microtransactions", https://partner.steamgames.com/doc/features/microtransactions (read, no date): "For any
  in-game purchases, you'll need to use the microtransaction API so Steam customers can only make purchases from
  the Steam Wallet."
- "Steam Keys", https://partner.steamgames.com/doc/features/keys (read): keys are "a free service we provide to
  developers as a convenient tool to help you sell your game on other stores"; only "for content that is available
  for purchase or download on Steam. This includes games, demos, and DLC"; "don't give Steam customers a worse deal
  than Steam Key purchasers"; free-to-play games "cannot request Steam Keys by default".
- So (my reading): (a) no inside the game; selling the game or DLC as Steam keys on our own site: yes, at a price
  no better than on Steam. (b), (c), (d) inside a Steam game: no Steamworks rule found: not confirmed.
- Steam Frame: "How to upload Android APKs to Steam" (https://partner.steamgames.com/doc/steamhardware/steamframe/apk_upload,
  read): "check Android under Supported Operating Systems". Whether a TWA runs there: not confirmed.

## 1.4 Google Play / Android XR
- "Service fees", https://support.google.com/googleplay/android-developer/answer/112622 (read 10.10): for users in
  "Australia, the European Economic Area, Japan, United Kingdom, or United States", from "June 30, 2026 for the
  EEA, UK, and US; September 30, 2026 for Australia and Japan": "First $1M (USD) of annual earnings: 10% + 5%
  billing fee"; above it ("Standard"), other transactions "20% + 5% billing fee" (new installs), "25% + 5%"
  (existing), "OR; 20% for external web links"; in "Play Games Level Up" 15% + 5% / 20% + 5% "OR; 15% for external
  web links". The "billing fee applies when a user completes a purchase ... using Google Play Billing". Other
  markets: "15% for the first $1M (USD) revenue earned by the developer each year", "30%" above it; South Korea and
  India alternative billing: the fee "reduced by 4%". (The rate for an external link inside the first $1M is not
  stated in the flattened table: not confirmed.)
- Payments policy, https://support.google.com/googleplay/android-developer/answer/9858738 (read): in-app purchases
  "must use Google Play's billing system ... unless Section 3, 8, or 9 applies"; apps "may not lead users to a
  payment method other than Google Play's billing system" through the listing, "webviews, buttons, links,
  messaging"; enrolled programs allow alternative billing and leading users out "in eligible countries/regions".
- Payments FAQ, https://support.google.com/googleplay/android-developer/answer/10281818 (read): "Google Play allows
  any app to be consumption-only, even if it is part of a paid service. For example, a user could log in when the
  app opens and access content paid for somewhere else"; such apps may give purchase information "without direct
  links", e.g. "Need extra lives? Head to our website to purchase more"; "We do not require parity across
  platforms"; "While the U.S. District Court's order remains in effect, developers may ... lead users in the U.S. to
  external content outside of the app if they are enrolled in the appropriate program(s)".
- So (my reading): (a) only in the enrolled programs (US, EEA, Korea, India), still with a fee; (b) a link only in
  those programs, plain text without a link in a consumption-only app; (c) yes; (d) yes, if nothing is sold inside.

## 1.5 Apple App Store / visionOS
- App Review Guidelines, "Last Updated: June 8, 2026", https://developer.apple.com/app-store/review/guidelines/
  (read): 3.1.1 "game levels ... or unlocking a full version), you must use in-app purchase. Apps may not use their
  own mechanisms to unlock content or functionality, such as license keys"; links to other purchase methods are
  barred "In all other storefronts, except for the United States storefront, where this prohibition does not
  apply"; 3.1.3(a) reader apps are only "magazines, newspapers, books, audio, music, and video"; 3.1.3(b) content
  bought on "other platforms or your web site" may be unlocked "provided those items are also available as in-app
  purchases within the app"; 4.2: apps must be "beyond a repackaged website".
- Small Business Program, https://developer.apple.com/app-store/small-business-program/ (read): "15% on paid apps
  and Apple In-App Purchases" up to "1 million USD in proceeds"; EU alternative terms: "10%".
- So (my reading): (a) no outside the EU terms; (b) US storefront yes; (c) only if also sold as IAP; (d) no
  (license keys forbidden). Our WebXR game is web only on Apple (4.2). Apple's US link-out commission in 2026:
  not confirmed.

## 1.6 SideQuest
- No fee and no store payments: "no plans to monetize content" (mixed-news.com, 2022, quoted in
  docs/research/projects/distribution.md). Its listing terms are behind a login: not confirmed. Whether Meta's app
  policies reach a sideloaded APK: Meta says "Sideloaded apps are not updated through our platform"
  (distribution-options, above); its policies speak of "apps hosted on the platform" (my reading: not sideloads).

## 1.7 itch.io
- https://itch.io/docs/creators/payments (read): the seller picks itch.io's share "from 0% to 100%"; at "the
  default rate, 10%": "$10 - ($10 * 0.1) - $0.30 - ($10 * 0.029) = $8.41"; in "Collected by itch.io" mode "itch.io
  is the Merchant of Record", "VAT is always automatically collected", payouts "via PayPal or Payoneer", minimum
  "$5.00 USD", review "typically ... 10 to 14 days". "Direct to you" mode: we are the merchant of record.
- https://itch.io/docs/creators/html5 (read): "all HTML5 games on itch.io are set up to only take payments as
  donations"; selling access needs "Downloadable". So a browser-played floor cannot be sold there (my reading).

## 1.8 Web-app stores
- heyVR (https://docs.heyvr.io/en/developers/publish-your-game, read): publishing flow only; fee and payments
  not found. HTC VIVERSE: search snippets only (distribution.md). Not confirmed.

## 1.9 The regional exceptions together
- US: Google, programs under the court order (1.4); Apple, no link prohibition on the US storefront (1.5).
- EU DMA, https://digital-markets-act.ec.europa.eu/gatekeepers_en (read): Meta's designated services are
  "Facebook, Instagram, WhatsApp, Messenger, and Meta Ads"; Alphabet's include "Google Play"; Apple's "AppStore".
  No VR store of Meta's is designated, so DMA steering rules do not reach it (my reading).
- Japan: Google's new schedule from 30 Sep 2026 (1.4). Korea, India: Google alternative billing at minus 4%.
  Apple in Japan and Korea, Meta anywhere: no exception found.

## 2. Payment providers for our own site (seller: an individual resident in Ukraine)
- Paddle (merchant of record). https://www.paddle.com/pricing (read): "5% + 50¢ per Checkout transaction"; "Global
  tax and regulatory compliance"; "If you're selling product with under 10$ value you can contact us for bespoke
  pricing." https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle (read):
  "Paddle works with software businesses anywhere in the world with the exception of" a list that names
  "Crimea (Region of Ukraine)", Donetsk, Kherson, Luhansk, "Zaporizhzhia (Region of Ukraine)", not Ukraine.
  https://www.paddle.com/help/start/account-verification/what-is-business-verification (read): "this step is not
  required for individuals or sole traders". https://www.paddle.com/help/manage/get-paid/when-and-how-do-i-get-paid
  (read): payouts "once a month", "min $100", "via wire transfer or Payoneer"; https://www.paddle.com/help/manage/get-paid/is-there-a-fee-taken-for-payouts
  (read): an international SWIFT transfer "will incur a wire fee of $/€/£15"; Payoneer: "all Payoneer fees"
  (Payoneer's fee page refused the browser: not confirmed). Whether Paddle accepts a VR game: not confirmed.
- Lemon Squeezy (merchant of record). https://www.lemonsqueezy.com/pricing (read): "5% + 50¢"; "We take on tax
  collection and calculation liability". https://docs.lemonsqueezy.com/help/getting-started/fees (read): "+1.5% for
  international (outside of the US) transactions", "+1.5% for PayPal transactions"; PayPal payouts "3% capped at
  $30 per payout for accounts outside the US". https://docs.lemonsqueezy.com/help/getting-started/supported-countries
  (read): "PayPal payouts are supported in 200+ countries"; Ukraine is not on the bank-payout list.
  https://docs.lemonsqueezy.com/help/getting-started/getting-paid (read): PayPal payouts "always in USD",
  "minimum payout threshold of $50".
- Xsolla (merchant of record for games). https://xsolla.com/monetization-toolkit (read): "fees starting from just
  5%"; it "handles tax, fraud, and compliance across 200+ markets". No public price list (/pricing redirects to a
  contact form, which also lists an office in "Perm, Russia"). Ukraine and individuals: not confirmed.
- Gumroad (merchant of record). https://gumroad.com/pricing (read): "10% + $0.50 Per transaction" on direct links;
  "Since January 1, 2025, Gumroad handles ALL your tax obligations". Payout to Ukraine: not confirmed.
- FastSpring: https://fastspring.com/pricing/ did not render: fee and eligibility not confirmed.
- Stripe: https://stripe.com/global (read): "Stripe is currently supported in the following countries/regions"; the
  list has no Ukraine.
- PayPal in Ukraine (the payout leg for Lemon Squeezy and itch.io): https://www.paypal.com/ua/webapps/mpp/paypal-fees?locale.x=en_UA,
  "Last Updated: 28, September 2026" (read): PayPal is "temporarily waiving some of its fees for ... receiving funds
  into Ukrainian PayPal accounts until further notice"; converting payments received "(including PayPal Payouts)"
  for Ukraine: "3.0%"; card withdrawal: "No Fee (when no currency conversion is involved)" for markets not listed
  (my reading of the table). A personal account receiving such payouts: not confirmed.
- LiqPay (Ukrainian acquirer): https://www.liqpay.ua/en/tariffs (read, Ukrainian page): "Standard 1.3% for
  Ukrainian cards, 2% for foreign cards" (translated); https://www.liqpay.ua/uk/information/requirements?tab=0 (read):
  "Information about the FOP or legal entity must be available to users" (translated): closed to an individual.
  WayForPay: its pages returned 404; Fondy, Solidgate: not reached.
- Our own VAT duty with a plain acquirer: the EU non-Union scheme, https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/declare-and-pay-oss_en
  (read), covers "supplies of services to non-taxable persons taking place in the EU", "The tax period is the
  calendar quarter", a nil return is due too. itch.io's docs (above): "EU-VAT also applies to non-EU business".
  With a merchant of record, the merchant is the seller and carries this.

## 3. A $10 sale (a US buyer without sales tax; before income tax)
EU VAT comes off the price on every route (Meta's 1.10 too). The owner as an individual then pays 18% + 5% = 23%
on what arrives (docs/research/meta-payout-ukraine-2.md), the same on every route.
- Meta add-on: 70% of Net Revenues, which first lose "sales processing costs or fees" = at most $7.00. Monthly at
  $100 or more; bank fees ours (meta-payout-ukraine.md).
- Our site with Paddle: $10 - ($0.50 + 5% of $10) = $9.00; minus $15 SWIFT on each monthly payout (1.5% of a
  $1,000 month, 15% of a $100 month). An EU buyer: whether 5% is taken on the price with VAT: not confirmed.
- Our site with Lemon Squeezy: $9.00 for a US buyer, $8.85 for a non-US buyer (+1.5%); after the 3% PayPal
  payout $8.73 / $8.58; converted to hryvnia by PayPal at 3.0%: about $8.32 (my arithmetic).
- Gumroad, direct link: $10 - $1.50 = $8.50 (payout to Ukraine not confirmed).
- itch.io (downloadables only), its share set to 0%: $10 - $0.30 - $0.29 = $9.41; at the default 10%: $8.41.
- Google Play with Play Billing, first $1M: 15% = $8.50. As a consumption-only app: whatever our site keeps ($9.00).
- Steam: in its store, 70% = $7.00 (base rate not confirmed from Valve); a Steam key sold on our site through
  Paddle: $9.00 (keys cost nothing).
- Plain acquirer (LiqPay, foreign card 2%): $9.80, then our own EU VAT on EU buyers (one-sixth of a 20%-inclusive
  price, $1.67) and quarterly returns; needs a FOP, so not open now.

## 4. Verdict (routes that break no store rule found)
| Route | Kept of $10 | Where it is allowed | Risk of removal | What the player sees |
|---|---|---|---|---|
| Meta add-on in the Store app | at most $7.00 | Meta (the only way inside its app) | none | buys a floor in VR with his Meta account |
| Our site in the Quest Browser, Paddle | $9.00, minus $15 per monthly wire | no store involved | none if the Store app neither shows nor names the web shop (my reading) | opens youaretheobject.com, pays on Paddle's checkout |
| Same, Lemon Squeezy | $8.85, about $8.58 after PayPal | no store involved | as above | Lemon Squeezy checkout |
| Google Play: free consumption-only app + login | as our site ($9.00) | Google Play (FAQ) | low, if nothing is sold inside and no link | logs in; may read "buy on our website" without a link |
| Steam keys sold on our site | $9.00 | Steam, price no better than on Steam | low with that parity | gets a Steam key |
| Bulk licences to schools and companies | our site's figure | Meta 1.1.2 | none | the institution buys; delivery to its headsets: not confirmed |

Excluded as against a rule read above: our checkout, a link or a "buy on the web" line inside the Meta app (1.1.1,
3.3.3); unlocking web purchases in the Meta app for single players (1.1.1, no exception); license keys on Apple
(3.1.1). Uncertain, so not used until answered: selling Meta Keys on our site; PICO's and SideQuest's rules.
The Meta app can open the same site: it must hide the web shop when it runs as the Store app (Meta's own check is
`getDigitalGoodsService`, revision-1-store.md part 3) (my reading).

## To confirm before money moves
- Meta, in writing (Agreement 4.5(a)): may the Store app unlock floors bought on youaretheobject.com? may the
  listing's website link point at a site that sells floors (revision-1-store.md quotes Publishing.1 "must not be
  hosted on another distribution platform")? may Keys be sold? which "sales processing costs" come off first?
- Paddle: accepts a VR game sold by an individual in Ukraine; fee base with VAT; the "bespoke" price under $10.
- PayPal: a personal Ukrainian account receiving merchant-of-record payouts (Lemon Squeezy).
- Accountant or lawyer: the payout as an individual's foreign income (23%) or a FOP group 3 (5% + 1%), and
  whether a merchant-of-record payout counts as sales income or royalty (meta-payout-ukraine-2.md).

## Not reached
Valve's and PICO's agreements (logins), SideQuest's terms, heyVR's and VIVERSE's fees, FastSpring, WayForPay,
Fondy, Solidgate, Payoneer's fees, Apple's 2026 US link-out commission, Xsolla's terms for individuals.

## Parked on the owner's word (10.10: money and Meta set aside until the first payout is near)
Pages behind a login, to open then, not now: https://developers.meta.com/horizon/contact/ (the four Meta questions,
in writing), https://developer.picoxr.com/ (PICO's agreement), https://partner.steamgames.com/ (Steam's agreement),
https://sidequestvr.com/ (listing terms), https://www.payoneer.com/fees/ (fees to a Ukrainian bank),
https://www.paddle.com/ (does Paddle accept a VR game sold by an individual in Ukraine).
