# 09. Pictures for the corridor's end walls

Question (owner): the two end walls of the corridor are empty and do not draw the player to walk
there; hang a picture on one or both, chosen from real things. Everything is recreated from real
sources; options go to the owner as pictures first.

Geometry now (read from `src/app/lobby/scene.js` and `src/app/lobby/plan.js`):
- End walls at x = -6.6 and x = 8.0 (`PLAN.from`, `PLAN.to`), each 1.8 m wide (`WIDTH`), ceiling
  2.5 m (`CEIL`), a wooden rail at 0.8 m (`RAIL`), painted block (`PAINT.end` #858f74 above,
  `PAINT.endBelow` #59624c below), 4 in base. Nothing else is on them.
- Arrival spot x 0.7 (`SPOT`), so 7.3 m to each end wall.
- scene.js: "openings and flat things on the walls start and end on the 0.2 m block module"
  (tests/masonry.test.mjs), so a frame's edges should land on block joints.

Verification marks: **opened** = I read the page itself in this session (WebFetch or the browser);
**search** = only a search result; **unverified** = no source read.

## Parts (each gets an answer or "not found")
1. Q1. What hung on US psychology department / lab corridor walls in the 1970s: kinds, framing,
   size, height, strength of evidence.
2. Q2. How games and level designers draw a player to the far end of a corridor; what works in VR.
3. Q3. At least 6 candidate real images: author, year, file URL, resolution, licence (US and
   EU/Russia).
4. Q4. Period presentation: frames, poster/print sizes, hanging height, glazing.
5. Q5. Headset: size to read the subject at 7 m and a caption up close; texture budget.

## Q2. Drawing the player to the far end (level design)

- **Weenies: a landmark that pulls people toward a place; light the goal; the main path is the
  brightest thing.** Scott Rogers, "Everything I learned about level design I learned from
  Disneyland", GDC San Francisco 2009, transcript notes by Cory Doctorow,
  https://craphound.com/disneylandleveldesign.txt — **opened**. Quotes: "weenies (landmarks that
  draw guests towards certain locations)"; "Lighting to draw people toward goal"; "Squint test:
  ... the main path is the brightest thing on the screen"; "Nooks and crannies that reward
  exploration". For us: a picture on an end wall is a weenie only if it reads as *something* from
  the arrival spot (shape, colour, contrast against the green-grey block) and pays off up close.
- **Key lights create contrast and a hierarchy of where to go.** Robert Yang (with David Shaver,
  Naughty Dog), "How To Light A Level", GDC 2018 Level Design Workshop, summary and slide links at
  https://www.blog.radiator.debacle.us/2018/03/gdc-2018-how-to-light-level-slides-and.html —
  **opened**. Quotes: "using point lights and spotlights to draw more attention to where the player
  might want to go"; "you want to create contrast with these key lights"; "One important concept
  here is hierarchy." Slides/notes are Dropbox PDFs linked there (not read).
- **Already in our research (docs/research/vr/05b-attention-reveals.md, §3):** in 360°/VR studies a
  static light did not redirect gaze while sound and motion did (Rothe & Hußmann 2018), and
  diegetic cues kept presence higher than arrows (Rothe, Buschek & Hußmann 2019). For us: a still
  picture alone is a weak lure in VR; its pull comes from contrast and from being the only
  distinct thing at the end of a long uniform view.

## Q4. Period presentation (frames, sizes, height)

- **Metal section frame (the "Nielsen" type) existed in 1979; invented late 1960s for lending
  prints and drawings; on retail sale from 1968; originals silver or gold only.** Wikipedia,
  "Metal Section Frame", https://en.wikipedia.org/wiki/Metal_Section_Frame — **opened**. Quotes:
  "invented by picture framer Donald P. Herbert (1926–1982) in the late 1960s"; "In 1968 metal
  section frames were also made available for retail sale for the first time"; "only available
  in a silver or gold finish". Nielsen brand in the US from 1974: **search only** (A Street Frames,
  https://astreetframes.com/frame-history/the-ubiquitous-metal-section-frame-and-its-true-inventor/,
  retailer page, not opened). For us: a narrow silver aluminium frame round a print is period-correct
  for 1979 and matches the aluminium of our cork board.
- **Hanging height (museum accessibility standard, not a 1979 rule):** Smithsonian Guidelines for
  Accessible Exhibition Design (Smithsonian Accessibility Program; undated in the copy read),
  https://www.sifacilities.si.edu/sites/default/files/Files/Accessibility/accessible-exhibition-design1.pdf
  — **opened** (PDF text extracted). Quotes: "Wall labels mounted with a centerline at 1370 mm
  (54 in.) above the floor are at optimum height for everyone"; labels "between 1220 mm (48 in.)
  and 1675 mm (67 in.)" are comfortable seated and standing; "Mount small items (to center line)
  at no higher than 1015 mm (40 in.)" (for seated viewers). The common "57-60 in centre" picture
  rule was found only on art-seller blogs (search results, not a standard): **unverified as a
  standard**.

## Q3. Candidate real images (licences read from each Commons file page)

Method: size, file URL and the licence templates on each file page were read through the
Wikimedia Commons API (`prop=imageinfo|templates`, the same data the file page shows), and the
Mach page was also opened directly. "File page" links below are the Commons pages. Licence
terms abroad: Commons, "Copyright rules by territory/Russia",
https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Russia — **opened**:
standard term "Life + 70(74) years"; anonymous works "Publish + 70 years"; PD if "The author
died: (a) before January 1, 1952". The Russian Civil Code art. 1281 itself (legalacts.ru,
zakonrf.info) refused the connection: **not read**.

| # | What, author, year | File (original) | Pixels | Licence on the file page | EU / Russia |
|---|---|---|---|---|---|
| 1 | Wundt's research group in the Leipzig laboratory, around an apparatus, ca. 1880, author unknown | [File:Wundt-research-group.jpg](https://commons.wikimedia.org/wiki/File:Wundt-research-group.jpg), https://upload.wikimedia.org/wikipedia/commons/a/a3/Wundt-research-group.jpg | 552 x 400 | Public domain, `PD-old` | PD-old covers life+70: yes |
| 2 | Wilhelm Wundt, portrait photo, 1902 (Weltrundschau zu Reclams Universum), author unknown | [File:Wilhelm Wundt.jpg](https://commons.wikimedia.org/wiki/File:Wilhelm_Wundt.jpg), https://upload.wikimedia.org/wikipedia/commons/5/56/Wilhelm_Wundt.jpg | 710 x 956 | Public domain, `PD-EU-no author disclosure` | EU yes; US tag absent on page (published 1902, before 1931: my reading, unverified tag); Russia: anonymous pre-1943, yes |
| 3 | William James seated, photo by J. Notman, Boston, 1880 (Houghton Library 2002M-44 (56)) | [File:Houghton 2002M-44 - James by Notman, 1880.jpg](https://commons.wikimedia.org/wiki/File:Houghton_2002M-44_-_James_by_Notman,_1880.jpg), https://upload.wikimedia.org/wikipedia/commons/4/40/Houghton_2002M-44_-_James_by_Notman%2C_1880.jpg | 1317 x 2001 | Public domain, `PD-old` | yes |
| 4 | Freud, Hall, Jung, Brill, Jones, Ferenczi in front of Clark University, Sept 1909, author unknown | [File:Hall Freud Jung in front of Clark 1909.jpg](https://commons.wikimedia.org/wiki/File:Hall_Freud_Jung_in_front_of_Clark_1909.jpg), https://upload.wikimedia.org/wikipedia/commons/e/e1/Hall_Freud_Jung_in_front_of_Clark_1909.jpg | 2868 x 2288 | Public domain, `PD-US` only | not tagged; anonymous 1909, so "Publish + 70" has run: my reading, **unverified** |
| 5 | "Kaninchen und Ente", earliest duck–rabbit, Fliegende Blätter 23 Oct 1892, artist unknown | [File:Kaninchen und Ente.png](https://commons.wikimedia.org/wiki/File:Kaninchen_und_Ente.png), https://upload.wikimedia.org/wikipedia/commons/a/ab/Kaninchen_und_Ente.png | 1414 x 1200 | `PD-US-expired`, `PD-anon-70` | yes (anonymous, 70 years from publication) |
| 6 | Duck or rabbit head, Jastrow, "The Mind's Eye", Popular Science Monthly vol. 54, 1899 | [File:PSM V54 D328 ...](https://commons.wikimedia.org/wiki/File:PSM_V54_D328_Optical_illusion_of_a_duck_or_a_rabbit_head.png), https://upload.wikimedia.org/wikipedia/commons/1/13/PSM_V54_D328_Optical_illusion_of_a_duck_or_a_rabbit_head.png | 1246 x 1097 | `PD-US` only | not tagged; anonymous 1899: my reading, **unverified** |
| 7 | Ernst Mach, the view from his own left eye ("Innenperspektive"), drawing; Analysis of Sensations 1886 | [File:Ernst Mach Innenperspektive.png](https://commons.wikimedia.org/wiki/File:Ernst_Mach_Innenperspektive.png), https://upload.wikimedia.org/wikipedia/commons/b/b8/Ernst_Mach_Innenperspektive.png | 1100 x 1400 | Public domain, `PD-old-100-expired` | yes (life+100) |
| 8 | Francis Galton, composite photographs of a family (plate XXXIII of Pearson's Galton biography), 19th c. | [File:Galton Composite Photograph of Family.jpg](https://commons.wikimedia.org/wiki/File:Galton_Composite_Photograph_of_Family.jpg), https://upload.wikimedia.org/wikipedia/commons/f/f2/Galton_Composite_Photograph_of_Family.jpg | 17509 x 15052 | Public domain, `PD-old` | yes |
| 9 | Dogs with their keepers, Pavlov's Physiology Department, Imperial Institute of Experimental Medicine, St Petersburg, photo 1904 | [File:Dogs with their keepers ... L0074966.jpg](https://commons.wikimedia.org/wiki/File:Dogs_with_their_keepers_at_the_Physiology_Department_Wellcome_L0074966.jpg), https://upload.wikimedia.org/wikipedia/commons/0/00/Dogs_with_their_keepers_at_the_Physiology_Department_Wellcome_L0074966.jpg | 7609 x 5728 | **CC BY 4.0**; credit on page: "Wellcome Collection gallery (2018-03-29): https://wellcomecollection.org/works/szhm2m2c CC-BY-4.0" | CC BY works everywhere with attribution |
| 10 | Eadweard Muybridge, "The Horse in Motion", 1878 (Library of Congress) | [File:The Horse in Motion high res.jpg](https://commons.wikimedia.org/wiki/File:The_Horse_in_Motion_high_res.jpg), https://upload.wikimedia.org/wikipedia/commons/d/d2/The_Horse_in_Motion_high_res.jpg | 5694 x 3510 | Public domain, `PD-old-100-expired` | yes |
| 11 | Wilhelm Wundt, drawn portrait by Dora Arnd-Raschid (1869-1938), 1898 | [File:Dora Arnd-Raschid - Portrait Wilhelm Wundt, 1898.png](https://commons.wikimedia.org/wiki/File:Dora_Arnd-Raschid_-_Portrait_Wilhelm_Wundt,_1898.png) | 449 x 558 | Public domain, `PD-old-auto-expired`, `PD-Art` | yes (died 1938, before 1952) |

Quotes from the file pages: Mach "This work is in the public domain in its country of origin and
other countries and areas where the copyright term is the author's life plus 100 years or fewer"
(opened). The Pearson copy of the Mach drawing (File:Autoportrait d'Ernst Mach p.64 The Grammar of
Science, Karl Pearson, 1900.png, 529 x 497, PD-old-70-expired) states: "Another version was
published by Mach himself in 1886 in Analysis of Sensations". Kaninchen und Ente: "the earliest
known version of the duck–rabbit illusion, from the 23 October 1892 issue of Fliegende Blätter".

Notes for choosing (my reading, not evidence of 1979 walls):
- Too small for a large print at full sharpness: #1 (552 px) and #11 (449 px). #1 is the only
  candidate that *shows a laboratory with a subject at an apparatus*; it would have to hang small.
- Quiet foreshadowing of "you are the subject" (taste, not evidence): #1 (people being measured
  at an apparatus), #7 (the world drawn from inside one observer's eye), #5/#6 (an ambiguous
  figure: what you see depends on you), #9 (Pavlov's subjects on a lead, walked by their keepers).
- Rejected: File:Rubin vase.png (a 2024 Blender render, CC BY 4.0, not a period object); M.C.
  Escher (in copyright, per the task). W. E. Hill's "My Wife and My Mother-in-Law": licence
  **not checked**, left out.
- **Label type by viewing distance (museum standard):** same Smithsonian PDF, Fig. 12 "Accessible
  Type by Probable Viewing Distance" (credited "Courtesy Parks Canada", PDF page 28, figure
  viewed): Helvetica Regular x-height 4.5 mm (24 pt) for "Less than 75 mm (3 in)" [as printed],
  9 mm (48 pt) at 1 m, 19 mm (100 pt) at 2 m, 28 mm (148 pt) at 3 m; text: "Minimum type size, at
  even the shortest distance, is an x-height of 4.5 mm (3/16 in.)".

## Q5. Headset sizes (my arithmetic on figures already verified in our docs)

Inputs: Quest 3 "1218 PPI | 25 PPD" (Meta compare page, verified in
docs/research/vr/01-meta.md line 170); our canvas rule `pxPerM(d) = PPD / (d tan 1°)`
(src/engine/ui/sheet-math.js); our smallest letter 1.375° = 24 mm at 1 m, a font size (em)
(docs/decisions.md, docs/research/vr/03c-viewing-text.md); Quest 2 cap-height legibility
threshold about 0.31-0.38° (Kilpeläinen & Häkkinen 2023, in 03c).

- **Angular size from the arrival spot (7.3 m):** 18 in wide (0.457 m) = 3.59°; 24 in (0.610 m)
  = 4.78°; 36 in (0.914 m) = 7.17°. At 25 PPD that is about 90, 120 and 179 display pixels across.
  On the 1.8 m end wall a 24 in wide sheet fills a third of the width, a 36 in wide one half. Whether a subject (a face, a
  duck-rabbit) "reads" at ~120 px: **unverified**, check in the headset (`tools/quest-look.mjs`).
- **Texture size needed:** 196 px/m at 7.3 m, 477 at 3 m, 1432 at 1 m, 2864 at 0.5 m. So a
  0.61 m wide print, sharp to 1 m, needs about 873 px across (a 1024 px wide texture); sharp to
  0.5 m, about 1746 px (2048). Sources with fewer pixels (#1 552 px, #11 449 px) are sharp only
  from about 1.6 m and 2 m away at 0.61 m wide (my arithmetic).
- **Caption up close:** our rule gives 24 mm font size per metre of reading distance; a label
  read at 1 m needs 24 mm letters (a real museum label at 9 mm x-height per Smithsonian Fig. 12
  is too small in the headset: the large-print deviation of docs/decisions.md applies).
- **Budget:** Meta's WebXR page asks for KTX2/Basis textures and Quest 2 under 100 draw calls
  (01-meta.md lines 171, 176); each picture is at least one more draw call unless merged with the
  static corridor (scene.js merges static parts).

## Q1. What hung on 1970s US psychology corridor walls

**Answer so far: no direct evidence found online.** Ten searches in English (department
histories, archives, Commons, memoir phrases) found no photograph or text describing what hung in
a 1970s US psychology department corridor. What was found, by strength:

- **Portraits of founders, in a meeting room, not a corridor (Harvard):** "The 15th floor has a
  William James conference room, in which hang portraits of the professor and his father and
  grandfather." Cambridge Historical Society, William James Hall,
  https://historycambridge.org/james/James%205.html — **opened**. Date the portraits went there:
  not stated. Strength: one building, one room, undated.
- **Engraved portraits at building entrances (Michigan State Psychology Building, of physicists):**
  search snippet only (https://psychology.msu.edu/about/facilities.html), **unverified**, modern.
- **Department group photos (faculty and staff), ca. 1960-1975:** Wake Forest University Archives
  Photograph Collection, Psychology Department series RG16.22, search snippet only
  (https://wakespace.lib.wfu.edu/handle/10339/39540), **unverified**. Shows such photos were
  taken, not that they hung in a corridor.
- **A 1970s psychologist's office photo exists** (Eric Schopler "in his office circa 1972", Cummings
  Center item, https://scholarexchange.furman.edu/schopler-images/26): search snippet only, not
  opened; would show office walls, not a corridor.
- **Where the evidence lives:** Archives of the History of American Psychology (Cummings Center,
  Akron), https://www.uakron.edu/chp/research/onsite — **opened** in the browser: "Appointments
  must be made at least two weeks in advance. Contact our Reference Archivist at ahap@uakron.edu";
  "Digital reproductions are intended only for personal use. Additional licensing fees are
  required for any academic or commercial use". So their photos cannot go into the game without a
  licence; they could still answer *what kind* of thing hung (a person must ask).
- **1979 was the centennial of experimental psychology, dated from Wundt's Leipzig laboratory:**
  "At the 1979 annual meeting of the American Psychological Association a special series of
  twenty-two symposia and lectures was devoted to the theme of 'A Century of Psychology as Science:
  Retrospections and Assessments'" (Leary, D. E., "One hundred years of experimental psychology: An
  American perspective", Psychological Research 42, 175-189, 1980, doi:10.1007/BF00308701; abstract
  page https://scholarship.richmond.edu/psychology-faculty-publications/117 — **opened**). The
  founding was dated to the winter of 1879-80 and the year itself was argued (search results only:
  Springer doi:10.1007/BF00308688; Boring 1965). For us: a portrait of Wundt has a period reason in
  a 1979 experimental psychology laboratory, which no other kind here has.
- Kinds with **no evidence found** (plausible, not shown): prints of perceptual illusions, APA or
  conference posters, Psychology Today posters, art reproductions, framed photos of apparatus,
  diplomas in corridors, maps. Treat any choice among them as **unverified for 1979 corridors**.

### Q2 continued
- **Measured: a contrasting light at the goal drew players far better than lit objects.**
  Krukowski, Zawisza, Wiśniewska, Wojciechowski & Szrajber, "The Effectiveness of Visual Attention
  Patterns in the Process of Spatial Exploration in a 3D Video Game Environment", ICCS 2025,
  doi:10.1007/978-3-031-97573-8_5, camera-ready PDF
  https://www.iccs-meeting.org/archive/iccs2025/papers/159120061.pdf — **opened** (text
  extracted). 36 participants, on a screen (not VR). Quotes: point light level II "achieving a
  92.7% visibility rate, with most participants immediately navigating toward the illuminated
  portal"; "The illuminated objects variant proved the least effective of the light-based
  methods"; citing Marples, contrasting paths gave "nearly halving the completion time". It also
  retells Rogers: Disneyland dims the areas far from the castle at closing, "increasing the
  contrast between the central castle and its surroundings".
- **What this means for our corridor (my reading of the code):** the five troffers sit at x
  -4.18, -1.74, 0.70, 3.14, 5.58 (`TROFFERS` in scene.js, computed with tile-math.js), so the end
  walls (x -6.6 and 8.0) are about 2.4 m beyond the last troffer's centre and are the dimmest part
  of the corridor: the opposite of a lit goal. A picture there competes with darkness unless it is
  pale on the dark green-grey wall, or the lighting changes (a lighting change must itself come
  from a source; not researched here).
- Valve Half-Life 2 commentary on landmarks: the transcript (Combine OverWiki) was not opened; not
  used.

### Q4 continued
- **Glazing:** non-glare (etched) picture glass existed by 1979. Tru Vue, "Our story",
  https://tru-vue.com/our-story/ — **opened**: "This etched glass product is what brought Tru Vue
  into the picture framing market in 1970." (maker's own history). Whether a lab corridor print
  had glass, non-glare glass or none: **unverified**. For us: etched glass gives a soft sheen, not
  a mirror; plain glass would mirror the troffers.
- **Poster and print sizes in the 1970s:** **not found.** Only modern printing guides (18 x 24,
  24 x 36, 27 x 40 in "most common"; search results, e.g.
  https://www.custompictureframes.com/resources/poster-frame-sizes-guide, not opened) and a
  modern classroom set of illusion posters at 11 x 17 in (search result,
  https://www.socialstudies.com/product/optical-illusions-posters/, not opened). Our corridor
  already uses US Letter for sheets; a print size must come from a dated source before it is used.
- **Hanging height in 1970s practice, thumbtacks or hangers on block:** **not found.**

## What was not reached / left open
- Q1 has no period evidence; it needs a person to ask an archive (see the owner list below).
- Russian Civil Code art. 1281 text: both Russian law sites refused the connection; the term was
  read from the Commons territory page instead.
- Robert Yang's GDC 2018 slides (Dropbox PDFs) and the Half-Life 2 commentary transcript: not read.
- Whether a subject reads at ~120 display pixels from 7.3 m: a headset check, not research.

## Summary
1. Q1: no photo or text found showing what hung in a 1970s US psychology corridor; only
   founders' portraits in a Harvard conference room (undated) and departmental group photos
   (ca. 1960-1975, existence only). Every kind is unverified for corridors.
2. Q2: weenies (Rogers 2009), key light and contrast hierarchy (Yang 2018), point light at the
   goal 92.7% vs lit objects weakest (Krukowski et al. 2025, desktop); in VR a static light alone
   did not turn heads (Rothe & Hußmann 2018, in 05b). Our end walls are the dimmest part.
3. Q3: 11 real images with licences read on Commons; strongest for us: Wundt's group at an
   apparatus (PD, but 552 px), Mach's view from his left eye (PD life+100), the 1892 duck–rabbit
   (PD-anon-70), William James by Notman 1880 (PD-old), Muybridge 1878 (PD), Pavlov's dogs 1904
   (CC BY 4.0, Wellcome Collection).
4. Q4: metal section frames existed (retail from 1968, silver or gold); non-glare framing glass
   from 1970; museum label centre 54 in (Smithsonian); period print sizes and hanging heights
   not found.
5. Q5: at 7.3 m a 24 in print is 4.78° (~120 px at 25 PPD); sharp to 1 m needs ~873 px across
   (1024 texture), to 0.5 m ~1746 px (2048); captions 24 mm per metre of reading distance.

## Needs a person
- Cummings Center reference archivist, ahap@uakron.edu (https://www.uakron.edu/chp/research/onsite):
  ask for 1970s photos of US psychology department corridors or labs that show what hung on the
  walls (kind, frame, size, height). Their copies cost a licence for any use; we need only the kind.
- Northwestern McCormick Library and University Archives, specialcollections@northwestern.edu
  (https://www.library.northwestern.edu/libraries-collections/distinctive-special-collections/mccormick-library/):
  ask for 1970s interior photos of Swift Hall (psychology) corridors.

## Brought by the owner (pages that refuse tools)
- **Nielsen metal section frame, Style 11** (Dick Blick product page, its dimension drawing; the owner's
  screenshot): face 9/32 in (7.1 mm), profile depth 13/16 in (20.6 mm), rabbet 13/32 in (10.3 mm); sold
  in pairs of sections by whole inches. For a metal-framed print or notice elsewhere in the building.
- **NEDCC Preservation Leaflet 4.10, "Matting and Framing for Works on Paper and Photographs"** (2019;
  the owner's PDF): the window mat is "the standard mount for works on paper"; glazing "is an essential
  component of the frame package for works on paper"; no mat border widths are given.
- Neither is used for the end walls: the owner chose the painting's museum frame (no mat), see scene.js.
