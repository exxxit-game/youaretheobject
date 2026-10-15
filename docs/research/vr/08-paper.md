# 08. Paper in the headset: how a document stays readable whole

Question: a paper document in the game (a form on the clipboard, with a signature line and an
office seal) must read whole in a Quest, small print included. Comfortable text in the headset
needs about 2.3 times the angle of text on paper held in the hand (24 mm letters at 1 m against
12 pt at about 40 cm), so a real page at its real proportions cannot show its small print. How
did people who had this problem solve it? Time-boxed research (4 searches, 5 page fetches).

Verification marks: **read** = the claim was read on the source page itself; **unverified** = only
a search summary saw it; do not build on it.

## Large-print documents (read)

Source A: UK Association for Accessible Formats, G003 *Creating clear print and large print
documents*, 2012 (https://www.ukaaf.org/standards/creating-clear-print-and-large-print-documents/;
PDF copy https://webs.uab.cat/act/wp-content/uploads/sites/126/2017/03/ukaaf-creating-clear-print-and-large-print-documents.pdf).
Pages 1–20 and 33–41 read.

- **A large-print document is set again in large type, not enlarged** — p. 10 rule 2 — read —
  "It is not acceptable to enlarge a document to A3 on a photocopier" — For us: the clipboard's
  page is such a document: its text is set for the headset, not a photo of a real page.
- **Large print: at least 16 pt, 18 recommended; 24 pt is giant print** — p. 7, 10, 18 — read —
  "Minimum text size of 16 point for large print" — For us: our body text (28 mm on a Letter page
  scaled 2.59 times) is about 31 pt in paper terms, giant print.
- **No small print survives: page numbers, footnotes, captions are raised to body size** — p. 11
  rule 4, p. 20 note 3.4 — read — "any 'small print' must be increased to match" — For us: nothing
  printed on a page may be smaller than the page's smallest text role.
- **Text inside a picture keeps the size of the text round it** — p. 15 rule 7, p. 34 note 6.2,
  p. 40 note 6.7 — read — "Any text labels must also match the size of any accompanying text" —
  For us: a seal's ring, a stamp's words, a scale's anchors are sized from the text, never from the
  paper.
- **A picture is kept only if it carries information; it may be simplified, never lose it** —
  p. 33–34 note 6.1–6.2 — read — "It is essential this information is retained." — For us: the
  lab's seal carries who certifies the form; it stays.
- **A picture that must grow goes on a turned or larger page** — p. 40 note 6.6 — read — "A larger
  page size such as A3 can also be used" — For us: a seal grown to its text's size may need a page
  of its own.
- **The large-print version runs to more pages** — p. 14 rule 17 — read — "a significantly larger
  document than the original" — For us: a form splits into pages; nothing is cut.
- **The sender stays at the start** — p. 8 — read — "Title and originator of the document should
  be at the beginning".

Source B: CNIB, *Accessible Form Creation CNIB Guidelines*, 25 March 2019
(https://healthsci.queensu.ca/source/edi/Quick%20Reference%20Guide%20-%20Making%20Accessible%20Forms%20-%20CNIB.pdf).
All 5 pages read.

- **One large font across the whole form, answer fields included** — p. 2 — read — "Use a large
  sans serif font across the entire form".
- **Check boxes the size of the font** — p. 3 — read — "Ensure that the checkbox is the same size
  at the font" (sic).
- **Room to write: at least 3 lines visible for written answers; the signature in a field of its
  own** — p. 3 — read — "Written digital signatures must be defined in specific field."

## VR games (unverified)

No studio postmortem or talk with paper sizes, text sizes or reading distances was found for
Half-Life: Alyx, Red Matter 1–2, The Room VR, I Expect You To Die or Lone Echo. Leads only:
Half-Life: Alyx lets the player take a poster's photo for a closer look (GameSpot, 2020); an
itch.io developer shows notes larger on a click; a reading study (VRDoc, arXiv 2211.03001, 2022)
saw people pull small-print documents closer. None of these numbers may be used until read in
the source.

## Paper colour (read)

- **Meta's limits** — "For light backgrounds, use colors no brighter than #DADADA. For dark
  backgrounds, use colors no darker than #1A1A1A", applied "to text, backgrounds, and all UI
  elements throughout your experience"; pure white and black "can cause eye strain" — Meta,
  "Color", updated 2026-04-19, https://developers.meta.com/horizon/design/styles_color/ — read.
  Read strictly in our code: every channel inside both limits.
- **White offset paper as measured** — FOGRA29, the ICC registry's characterisation data for
  ISO 12647-2 paper type 4 ("white, uncoated, 120 g/m2"), September 2003, D50, 2°, 45/0, white
  backing; the unprinted patch (C=M=Y=K=0): XYZ 86.44 / 89.31 / 76.37, L* 95.71, a* 0.61,
  b* -2.32 — https://registry.color.org/cmyk-registry/fogra29 (data file FOGRA29L.txt, opened).
  Bradford D50 to D65, then sRGB (IEC 61966-2-1): 242, 242, 247; dimmed in linear light until its
  brightest channel is 0xDA: 214, 214, 218 (#d6d6da), the paper's colour in the game.
- **Older paper was less blue** — in 2005 North American office paper's brightness went from about
  84 to 92 and its CIE whiteness from about 100 to 146; "The 'new' paper made in North America is
  much bluer" — Crable, "The Evolution of Tinting Dyes and Optical Brighteners in White Papers",
  TAPPI PaperCon 2011, p. 1611 (opened by the research agent, not by me).
- **Not found:** a colour measurement of a 1979 sheet. The cream the page had before (#e9e2cf,
  about L* 90, b* +10) has no source; it was chosen so that "white would not glare", which Meta's
  limit settles.

## Layout numbers (read)

- **No number for headings, paragraph space, margins or form fields** in UKAAF G003 (2012, PDF
  opened): headings "may need to be in larger text to differentiate them from body text" (p. 11,
  3.4); "Use a minimum of single line spacing" (p. 12, 5.7); "Leave space between paragraphs"
  (p. 12, 5.8), "a blank line between them" (p. 28); "Have adequate margins" (p. 13, 5.14); forms:
  nothing beyond "is their handwriting very large" (p. 51).
- **Leading at least 25 to 30 per cent of the point size** — CNIB, "Clear Print Accessibility
  Guidelines", July 2020, p. 10 (PDF opened). Our line pitch, 1.32 of the letter size, meets it
  either way it is read (as the gap or as the whole pitch).
- So the title's size over the body (44 and 28 mm), the gaps, the margin and the writing fields are
  our choices inside these rules, to be judged by reading in the headset, not sourced numbers.

## Not found

No large-print rule names stamps or seals; the nearest rules are "text inside pictures at body
size" and "an accurate representation of the original" (G003).

## For our game

The clipboard's page is a large-print document. Its text sets the size of everything printed on it
(rings and labels of seals and stamps, check boxes, table rows, scale anchors); the paper only gives
the page its shape. A document that does not fit grows in pages, nothing shrinks and nothing is cut.
A page on its hook is read from where the player stands: its lines for that distance get the
smallest letter's angle from there. The paper is white as measured, at Meta's light limit.
