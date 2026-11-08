# Quest geometry capture

Preparation record, 7 November 2026. This supports the inventory in
[the corridor design](perception-corridor.md). The owner chose Quest capture as the
first route to dimensions. The building has no verified metric capture yet.

## What the model needs

| Target | Needed data | Use and limitation |
|---|---|---|
| Entry corridor | Opposing wall surfaces, floor, ceiling, corner and opening | Establish width, height, distance to the first turn and occlusion. An overall mesh bounding box includes other objects and is not automatically the corridor width. |
| Landing and stairs | Landing boundaries, flight directions, visible step surfaces and height differences | Fit navigation to real architecture. Resolve actual step geometry before claiming tread/riser measurements. A coarse mesh may approximate a flight as a slope. |
| Shared landmarks | Door frame corners, wall intersections, window edges | Match capture to the owner's footage and register adjoining areas. Scan origins and IDs are session-local. |
| Fine details | Tile seams, grip, rail posts, picture and surface finish | Use existing photos/video and old detailed modules. An untextured scene mesh alone does not establish these features. |

First target for the building is the flat entry corridor from the door to the turn.
The first equipment trial verifies export in one already captured area. The room
used in that trial must be labelled so its data is not mistaken for the stairwell.

## Acquisition and export

Quest Space Setup captures a scene model. WebXR mesh detection reads geometry made
available by the system. Merely looking around on our export page does not establish
that a new scan of the current area was created. The page now states this explicitly.

Current Meta scene-data documentation describes on-device Space Setup, automatic
capture with a manual fallback, and planes, volumes and meshes. Meta's WebXR scene
understanding documentation describes mesh/plane features and runtime availability.
These APIs supply a reference-space geometry representation. The actual environment
coverage, detail and metric accuracy remain subjects of the device trial.

- https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-manage-scene-data/
- https://developers.meta.com/vr/documentation/iwsdk/guides/11-scene-understanding/
- https://developers.meta.com/vr/documentation/web/browser-specs/
- https://immersive-web.github.io/real-world-meshing/

Use `tools/xr-room.html?capture=1` for a stationary export trial. Its Start button
requests local-floor and mesh-detection, with plane-detection optional. The trigger
requests one synchronous snapshot from the next XRFrame. The seven old movement
steps are bypassed. The old `tools/xr-room-run.mjs` remains its original runner and
does not launch this short mode.

`tools/xr-room-geometry.mjs` copies each mesh's complete vertices, triangle indices,
semantic label, change time and pose matrix. It copies each plane polygon and pose.
Floors are retained. Objects with equal dimensions keep distinct session-local IDs.
Unavailable poses are recorded as skips. Coordinates keep the browser precision.
Header fields identify metres, local-floor, session ID, reference epoch, frame time
and the column-major local-to-reference matrix convention. Export time is not the
acquisition time of the system scene model.

Raw snapshots are committed to IndexedDB on the headset with readback before XR
ends. Reload restores the latest snapshot with an explicit previous-capture label.
The old multi-run localStorage summary remains small. A storage failure leaves the
raw snapshot in memory with an error state. The flat Download button provides a local headset download.
`tools/xr-room-save.mjs` reads the already open capture tab and writes a new absolute
filename on the laptop. It verifies the written hash, refuses an existing filename,
and removes its own partial file if the write fails. It never starts an XR session.
The laptop exporter distinguishes current and restored snapshots and checks the
active session ID when one exists. File receipt still requires coverage inspection.

## Readiness before asking the owner to connect

1. Check page syntax, public-module delivery and mode selection. Check a reference
   snapshot through capture, serialization, file write and readback with no headset.
2. Read the current method, identify the target area and name the output destination
   under F:\AI\work. Read the local port from policy/launch.json (3100 at this
   checkpoint), verify this server serves the current files, then forward Quest
   localhost:3000 to that verified port. Do not substitute a remembered port.
3. During the agreed device trial verify USB state and the loaded capture URL. A
   successful Android launch command alone does not prove that the page is visible.
4. Prepare the flat page before the owner waits in the headset. If a check is made
   with the headset off, restore any temporary proximity override in a finally block.
   Actual XR begins with the owner's Start press and required permission response.
5. Perform the first trial at a fixed position on a flat area. Save and inspect that
   result before planning a building capture. Treat areas and stair flights as
   separate acquisition targets according to what the native scan actually covers.

## First connection and flat-page preparation

Use the existing server and headset link helpers; the legacy walking runner is
not the preparation command. Verify /tools/xr-room.html?capture=1 and its two
modules against local file bytes and JavaScript MIME before opening that exact
URL on Quest localhost:3000. Confirm window.__roomState().mode is capture,
secure context, XR/AR support, and label any restored snapshot as previous data.
Opening the flat page and reading capabilities do not start an immersive session.
Off-head preparation may need a temporary keep-awake override. The existing
withStandProximity helper checks the real off-head state first and restores the
sensor in finally with readback, including failures. It does not start XR.
Applicable independent review still precedes an immersive trial; preparation is
not that review, a fresh capture, owner acceptance or survey calibration.

USB and flat-page loading were verified on 8 November; the owner also confirmed
the correct page briefly. Wi-Fi uses the configured laptop port, not a hardcoded
3000. Check the explicit network transport, then recheck after USB disconnection.
This does not prove stairwell Wi-Fi coverage. Use one stationary area for the first export,
with a separate capture card naming the intended area and unknown scan time.
Save a new file and inspect coverage before asking for a stairwell scan.

The cable-free check later passed with Quest as the only listed device and the
same capture page idle. The owner reported a power outage/router restart; a USB
read proved its address changed from .11 to .12. Old-IP failures cannot isolate
sleep. The new address answered after a power-button press. Rediscover addresses
after router changes; this result does not guarantee link persistence or range.

## Acceptance of a real capture

- Confirm a new nonempty snapshot and a verified file exist. One nonempty furniture
  mesh establishes export, with no guarantee of room coverage.
- Inspect transformed vertices and surface labels. Check coverage of opposing walls,
  floor, ceiling and the specific opening needed for the first section.
- Match identifiable landmarks to the owner's video. Record target area, unknown
  scene acquisition time, session origin and any reference reset.
- Register overlapping captures using shared surfaces/landmarks. Preserve scale and
  coordinate transforms. Independent session origins do not concatenate directly.
- Report coarse, missing or unstable surfaces. Compare repeated captures of shared
  edges for consistency. Such consistency is not an independent accuracy reference.
- Only then replace the corresponding provisional dimensions in the common plan.

## Current verified state

On 8 November Quest 3 answered over USB and explicitly addressed Wi-Fi. Its Browser
loaded capture=1 at localhost:3000 forwarded to laptop port 3100: secure context,
XR/AR support and idle state; A-Frame 1.8.0 and Three r184 loaded. No XR session,
mesh or room file was obtained. The off-head override was restored and read back.
This is flat preparation, not native rendering or geometry validation. An earlier
store-visible launch report remains an error, not evidence that a page opened.

The independent review found that the general practice gate covers all public
surfaces. A capture-only walkthrough cannot honestly approve that global scope.
Before Start, prepare a bounded diagnostic review rather than treating code-only
evidence as full-practice or requiring a successful capture in advance.

[Meta Scene Best Practices](https://developers.meta.com/vr/documentation/native/scene-best-practices/)
warns that a loaded scene may belong to another floor. Scene Mesh is created in
Space Setup and remains static; it is not high-precision survey geometry. A new
export time does not establish a new scan or its location. Check a door-to-turn
pilot against landmarks before stairs or overlapping floor captures; preserve
session transforms separately. WebXR area, vertical coverage and step detail
remain unverified.

## Ten-floor source atlas

The owner reports ten floors and proposes documenting the entire stairwell,
including small objects. The atlas supplies real repetitions, variations and
landmarks for the N corridor. First validate one area through export and inspection.
Use that trial to determine the coverage and effort needed for the full survey.

Each floor has a source card with its actual displayed floor number, capture date,
entry/landing/corridor views, views toward the adjoining flights, geometry files,
light state and visible landmark matches. Small-object close-ups supplement the
overview where text, profile or material is not readable. Reuse existing footage
when it already covers the required view. Record the actual acquisition method.

Use a common inventory across all floors. For doors, windows, rails, floors,
lights, cabinet, lift, extinguisher/sign, boards, plants and loose objects record
present, absent or uninspected. Present objects receive a floor-local ID, position
and source frame. Dimensions are measured, device-estimated or unknown. A missing
entry never silently means absent, and repeated architecture is checked before
being represented by a shared template.

The physical atlas retains observed placement and appearance. Game placements refer
to those source objects and record their assigned connections in the walk. This
allows a real doorway, a rail and a sign from different observations to contribute
to one designed discovery without losing their provenance.

Quest provides metric coordinates in its scene representation. A verified exporter
does not establish survey accuracy, complete fine detail, or automatic registration
of ten floors. Photos/video carry text and surface appearance. Matching overlapping
geometry checks consistency, with absolute accuracy still unestablished until an
independent reference is available. The owner has declined a manual tape survey.

Before requesting physical work, the operator specifies the question to resolve,
the required data, acceptance checks and why the owner's participation is necessary.
Operational preparation and an agreed capture card precede the owner's headset time.

The regression test checks typed-array copies, unrounded coordinates, retained
floor indices, distinct object IDs, updated poses, absent poses, invalid geometry,
file equality after write, and refusal to overwrite on retry. Physical feature
availability, room coverage and device Download remain unchecked. A flat-page test
on the real connected Quest passed secure-origin/AR-support detection, IndexedDB
write/readback and transfer to a verified laptop file using isolated synthetic
geometry. The test database and file were removed. No real-room capture was made.
