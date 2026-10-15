# Building standards for the lab (walk this before building or changing any scene part)

Every room and the corridor are a US university building of the late 1970s, built to trade
standards (CLAUDE.md: we recreate). Values in inches and metres; sources below the table. A number
marked "ours" is the game's rounding, with the reason.

| Part | Standard | In the game |
|---|---|---|
| Wall | concrete block, nominal 8 × 8 × 16 in (0.203 × 0.203 × 0.406 m), running bond [S11, S12] | blocks 0.2 × 0.4 m (ours: the metric modular block, 1.6% smaller, so walls stay whole half-blocks); walls 0.2 m thick |
| Wall length | laid out in half blocks; masonry opening 4 in wider and 2 in taller than the door, widths in 8 in steps, so no unit beside an opening is cut [S11] | every wall a whole number of 0.2 m (`tests/tiles.test.mjs`); door openings 1.0 m wide, their edges on the 0.2 m module (`tests/masonry.test.mjs`) |
| Door leaf | 3'0" × 7'0" (0.914 × 2.134 m), 1-3/4 in (45 mm) thick [S2] | same |
| Door frame | hollow metal, 2 in (51 mm) face; gap leaf–frame 1/8 in (3.2 mm) at jambs and head, at most 3/4 in (19 mm) at the floor [S2, S3] | same; frame stops hide the gaps |
| Hinges | 3 per leaf, 4-1/2 in (114 mm); top hinge top 9-3/4 in (248 mm) below the frame head, bottom hinge top 10-3/8 in (264 mm) above the floor, middle equally spaced [S2] | same, on the pull side |
| Knob | round knob (1979: levers came to Schlage's commercial locks only in 1983 and 1989); Schlage A Series Plymouth: 2-1/8 in wide, 2-5/16 in projection, rose 2-9/16 in (Allegion cut sheet, docs/decisions.md); strike centreline 40-5/16 in (1.024 m); operable parts 34–48 in (0.865–1.22 m); backset 2-3/4 in (70 mm) [S1, S2, S5] | same (src/engine/door.js) |
| Kick plate | 10 × 34 in (254 × 864 mm), 2 in narrower than the door, on the push side [S4] | same |
| Threshold | at most 1/2 in (13 mm) high; 5 in (127 mm) wide, aluminium [S1, S6] | same |
| Closer | regular arm, pull side or top jamb [S18] | on the pull side |
| Base | vinyl wall base 4 in (102 mm) high, 1/8 in thick [S7, S8] | 102 mm high, 5 mm thick (ours: 5 mm keeps it from flickering against the wall) |
| Floor | vinyl composition tile 12 × 12 in (0.305 m); no edge tile under half a tile [S8, S19] | same (`src/engine/tile-math.js`) |
| Ceiling | suspended grid 24 × 24 in (0.61 m), 15/16 in (24 mm) face [S9, S10]; main beams 48 in on centre, 4 ft cross tees every 24 in, 2 ft tees at their midpoints [S29] | same; a 2 × 4 troffer fills the opening between two mains, so a row steps by 4 ft: ours 8 ft apart |
| Light | fluorescent F40T12, 48 in (1.22 m) lamps [S14]; 1975 federal guidance: 50 fc at desks, 30 fc in work areas, under 10 fc in corridors [S13] | 2 × 4 ft troffers (0.61 × 1.22 m) in the grid; a 2-lamp F40 troffer with a pattern 12 lens spreads light evenly up to 1.25 times its height over the floor (spacing criterion 1.25 / 1.4, along / across) [S28]: 3.1 m under our 2.5 m ceiling; the corridor floor gets 0.1–0.2 of the light on a room's desk (`tests/smoke.mjs`) |
| Troffer lens | prismatic acrylic, pattern 12, 0.125 in (3 mm), in a steel or aluminium door frame with mitred corners [S20] | lens with the lamps showing as soft bands; frame 25 mm (ours: frame width not in the sources); 2 lamps (ours) |
| Tackboard | 1/4 in (6 mm) cork on hardboard; extruded aluminium trim about 1-3/4 in (44 mm) face [S21] | the experimenter's board in the corridor, same; 1.6 × 1.0 m (ours: its edges on the block joints, `tests/masonry.test.mjs`) |
| Notices | US Letter paper, 8.5 × 11 in, 215.9 × 279.4 mm, the paper of a US university in 1979 (docs/research/vr/07-corridor-1979.md, C21); psychology hallways carry flyers calling for participants, with tear-off strips (Indiana University, Psychological and Brain Sciences) | two Letter sheets on the board: a flyer and the studio's poster (`src/app/lobby/board.js`, `LETTER` in `src/engine/ui/sheet-math.js`) |
| Fire extinguisher | top at most 5 ft (1.524 m) above the floor for units up to 40 lb, bottom at least 4 in (102 mm) [S22]; 2.5 gal pressurized water (Class A) about 7 in (0.18 m) across, 24.5 in (0.62 m) tall, about 30 lb [S23] | one in the corridor, by the stairs (the way out); shaped after a 1972 General WS-900 (polished stainless, grey hose, gauge, label as on the original) |
| Room sign | on the wall at the latch side; lowest letter baseline at least 48 in (1.22 m), highest at most 60 in (1.525 m) [S1, 703.4.1]; allowed on the push side of a door with a closer [S1, 703.4.2]; characters 5/8 to 2 in [S1, 703.2.5] | one sign family [S25]: 9 × 9 in, centred 60 in up, on the leaf's corridor (push) face; a room's number centred, 2 in; the stairs' symbol [S26] 4 1/2 in over the word 3/4 in; a wall sign (inside room 01) 4 in from the frame (`SIGN` in `src/app/brand.js`, `tests/masonry.test.mjs`) |
| Light box over a door | (ours) as wide as the masonry opening, 1.0 × 0.2 m, on the joints | the sign over door 1 |
| Switch, outlet | switch 42 in (1.067 m), outlet 18 in (0.457 m) to centre; reach 15–48 in [S1, S15]; in a block wall the box is set as the courses are laid, notched into the block [S24] | switch at 1.1 m (ours: inside one course, so no joint runs beside the plate; within reach) |
| Corridor | at least 44 in (1.118 m) in a university building [S16, S17]; the 1976 code the same, 44 in, and a clear height of at least 7 ft (2.134 m) to the lowest projection from the ceiling; trim, handrails and fully open doors take at most 7 in (0.178 m) of the required width [S27, 3304(b)-(d)] | 1.8 m |

Not verified (do not present as fact): closer body position, the usual 1970s
ceiling height, colour temperature of 1970s cool-white lamps. For the ceiling
only a minimum was read: 7 ft clear to the lowest projection [S27, 3304(c)] (California Title 8
§3226(c) says the same); the codes set no usual height, so 2.5 m stays without a source; open
lead: a City of Alameda handout (7'-6" for UBC 1970/1973). Read for later from the same code:
exit signs with letters at least 6 in (152 mm) high and strokes at least 3/4 in (19 mm) wide, lit
by two lamps of at least 15 W each; exits lit with at least one footcandle (10.8 lx) at the floor
[S27, 3312(a)-(c)].

Sources (opened 08.10.2026):
S1 ADA 2010 Standards, ada.gov/assets/pdfs/2010-design-standards.pdf ·
S2 Steelcraft Tech Data Manual, Section 1 (Allegion) ·
S3 Steel Door Institute FAQ, steeldoor.org/faqs ·
S4 Ives, protection plates (iveshardware.com) ·
S5 cylindrical lockset backset, doorwaysplus.com blog ·
S6 Pemko 171A saddle threshold ·
S7 Roppe vinyl wall base ·
S8 UFGS 09 65 00 resilient flooring (wbdg.org) ·
S9 UFGS 09 51 00 acoustical ceilings (wbdg.org) ·
S10 Chicago Metallic 200 grid datasheet (rockfon.com) ·
S11 CMHA TEK 5-12 · S12 CMHA TEK 14-6 (cmha.org) ·
S13 Federal Energy Administration, Lighting and Thermal Operations guidelines, 1975 (stacks.cdc.gov) ·
S14 Srivastava & Sommerer, ECS Interface 1998 ·
S15 University of Arizona design standard 16140 ·
S16 California Building Code 2025, Table 1020.3 · S17 CBC 304.1 ·
S18 LCN 4040XP closer arm · S19 Armstrong tile instructions ·
S20 Hew 50 static troffer spec (hew.com); Signify SP troffer ordering guide (pattern 12 lens) ·
S21 VA master spec 10 11 23 tackboards (wbdg.org); Univ. of Houston master spec 10 11 00 ·
S22 NFPA 10, 6.1.3.8 (quoted by San Diego Fire-Rescue, sandiego.gov; same values in the 1994 edition) ·
S23 Kidde Pro 2.5 W-1 (466403) and Amerex 240 product listings ·
S24 Hubbell RACO masonry boxes: the mason builds to the device height and notches the block round the box (hubbell.com) ·
S25 Northern Illinois University, Campus Interior Signage Program: planning and purchasing guide, sign types A and E, installation (via cdb.illinois.gov) ·
S26 US DOT / AIGA Symbol Signs, "Stairs" (1979 set, public domain; Wikimedia Commons "Aiga stairs.svg") ·
S27 Uniform Building Code, 1976 edition (ICBO), Sec. 3304 Corridors and Exterior Exit Balconies, pp. 500-502, and Sec. 3312 Exit Signs and Illumination, p. 509 (archive.org uniformbuildingc0000unse_g4g9, borrow only; read 09.10.2026 on the owner's screenshots; 3305 there is Stairways) ·
S28 Metalux 2G-240A, 2 × 4 recessed troffer, two F40 lamps, .095 pattern 12 acrylic lens: photometric report 105P115 (Cooper Lighting, 2020, scaled from the original data): spacing criteria 1.25 / 1.4 / 1.41 (0/90/45), efficiency 78.2 %, a coefficient of utilization table; and a 40 W F40CW lamp, 3050 lm, from report 108P124 (webtools.cooperlighting.com; read 09.10.2026) ·
S29 Armstrong World Industries, Standard Suspended Ceilings: Assembly and Installation Instructions, 3.1.1.2 "Standard 2' x 2'": "Main beams spaced 48" O.C.", "4' cross tees shall intersect the main beams at 90° every 24" O.C.", "2' cross tees shall be installed at the midpoints of the 4' cross tees" (https://pdf.lowes.com/productdocuments/7125dd94-ee70-415d-a7fd-bdb349e74251/65890741.pdf; read 09.10.2026) ·
