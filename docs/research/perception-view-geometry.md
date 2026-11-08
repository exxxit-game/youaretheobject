# View geometry and acceptance

Supporting calculation from [the corridor design](perception-corridor.md).

## Calculation and acceptance

Use metres from a shared plan. Record camera/eye pose, foreground and background
edges, view direction, field of view and screen aspect. First calculate alignment
in the central view, then both eye positions and a reachable neighbourhood of poses.
Calculate occlusion separately. A horizontal coincidence alone does not establish
a complete contour or recognisable image. A pure rotation about a fixed optical
centre changes framing. A translation changes parallax. Real head tilt also moves
the eyes and their baseline.

Use one metric coordinate system for all participating surfaces. Each intended view
has an eye pose and a projection, shared by its floor, rail, wall and ceiling. Set
all intended drawings and target regions before solving the common construction.
Validate pairwise relationships sequentially while retaining the other constraints.
Multi-view Wire Art gives an existing method for two/three specified drawings and
views. Pozzo's figure C demonstrates projection from an eye point onto architecture.
Sugihara's 2020 triply ambiguous projection explicitly uses monocular viewing. Its
binocular VR use therefore remains a separate unverified condition.

- https://techart.nthu.edu.tw/wp-content/uploads/2019/11/Multi-view-wire-Art.pdf
- https://www.gutenberg.org/files/56312/56312-h/56312-h.htm
- https://www.jstage.jst.go.jp/article/jsgs/54/2/54_47/_pdf/-char/ja

For vectors a=A-E and b=B-E the angular mismatch is
atan2(length(cross(a,b)), dot(a,b)). With centred points at depths 2 and 5 m and an
example inter-eye distance of 64 mm, each eye's mismatch is about 0.54997 degrees.
This is a geometric example, with no recognition threshold or measured participant.
Choose a tolerance in relation to the visible contour width before judging a design.

Varini treats the selected vantage point as a starting point within a whole walk.
Raetz supplies actual precedents for several readings of one construction. Turrell's
Afrum supplies a light volume that resolves as a projection when approached. These
sources support candidate methods. The pilot work on Hughes concerns particular
textures, illumination and depth reversals, with no universal VR guarantee.

- https://varini.org/a-propos-de-felice-varini/
- https://www.centrepompidou.fr/en/ressources/oeuvre/cpgG6pE
- https://collections.lacma.org/object/140816
- https://pubmed.ncbi.nlm.nih.gov/33375245/
- https://threejs.org/docs/pages/Vector3.html

