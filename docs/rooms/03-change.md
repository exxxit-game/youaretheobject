# Second trial: Drori 2020, Experiment 1

Implementation in progress: an adjustable viewing preview, not the complete study.
Owner explicitly requested to see the room and try initial settings; no author contact.
The six preview slots do not replace or implement the original 24-staircase experiment.
No JND, clinical inference, population comparison or upload is performed.
The selected task is the original VR paired-view experiment, not the later
subjective-reality rating task and not a height-only demonstration.
The existing first trial and the old button/light room are preserved.

## Original procedure and implementation boundary

Primary source: https://doi.org/10.3390/jcm9061627 .
Supplement: https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7355917/supplementaryFiles .
The retrieved evidence and exact missing inputs are in
[source investigation](../research/drori-recreation.md).

| Original item | Source | Implementation status |
|---|---|---|
| Observing 360 degrees from a stationary point | Main pp. 4-5 | Experiment 1 posture unconfirmed; not implemented or checked on Quest |
| First view 2 s, black 1 s, second view 2 s, then same/different | Main p. 5, 2.6.1 | Renderer integrated with presentation acknowledgement; device timing pending |
| One altered and one unaltered view in each pair | Main p. 5 | Preview randomizes altered-view position, an own choice where source allocation is unspecified |
| Grain, roll, stretch, narrow, grow, shrink | Main p. 5 | All six implemented for adjustable viewing; rendered verification pending |
| Four randomly interleaved staircases per aspect, 24 total | Main p. 5 | Not implemented; preview order is grain, roll, stretch, narrow, grow, shrink, each repeatable |
| Training until acclimated, maximum 26 trials | Main p. 5 | Not implemented |
| Stated 1-up/2-down, 40 percent update | Main p. 5 | Conflicting response description unresolved; no update rule implemented |
| JND from last five trials in each staircase | Main p. 6 | No threshold computed without a valid complete procedure |
| Furnished apartment, animated cat, HTC Vive, Unity | Main pp. 4-5 | No claim that the approved booth or Quest is perceptually equivalent |

## Viewing preview and engineering choices

`src/rooms/03-change/protocol.js` separates published constants from PREVIEW values.
Strengths .25/.5/1 start at .5. Full strength: X scale 1 +/-.4, X tilt 8 degrees,
height displacement +/-.12 of booth height, or noise-overlay opacity .45.
These are our viewing settings, not recovered author levels or verified comfort limits.
Negative Unity X rotation becomes positive three.js X rotation after Z reflection.
Tracked head pose is preserved; height effects displace the environment instead.
Neutral physical eye height is retained, rather than forced to half room height.
The grain shader is our overlay, not Unity's original grain implementation.

Uses the existing approved booth, without old line apparatus or new furniture.
Only changeWorld transforms: rig, panels and controllers remain independent.
The app supplies placement/number. Stable identity 03-change carries no floor number.
Intro -> ready/strength -> two views/blank -> same/different -> feedback/repeat/strength
-> next aspect -> after all six, completion. Names appear after each response.
Answer order is randomized. Preview observations remain in the current page only.
Menu, XR visibility, exit and recenter interrupt a pair and restore ordinary rendering.
Mount requires a marked preview export; nothing replaces the production room.

`src/engine/paired-view.js` has no scene, distortion parameters, staircase defaults,
participant storage or network calls. Its caller must explicitly supply durations,
pair identity and altered-view order. Each phase waits for a presentation acknowledgement;
a delayed frame cannot advance through multiple unseen views. Responses require the
current displayed answer phase and cannot be submitted twice.

Our interruption handling is an engineering choice, not an author-specified rule:
holding a pair invalidates it; resumption requires a new pair from the first view.
Generation tokens reject events from the interrupted presentation. This does not
establish real display duration or headset-removal detection. Renderer/visibility
integration now exists; actual device measurement remains pending.

## Source inputs still required

Initial levels/bounds for each aspect, exact stopping and response-update rules,
and first/second alteration allocation remain unresolved. Total participant duration
is unknown. The later author CSVs and 2025 paper do not establish the 2020 settings.
The owner-authorized viewing preview uses its explicitly separate magnitudes and six
slots; it does not silently implement a different staircase as the original.
Five recordings were generated and transcription-checked; full npm test passed.
The full source review supports the labelled preview, not original-study fidelity.
Hosted smoke, actual Quest playthrough and acceptance remain pending.

Next: practice review, hosted rendered checks and actual Quest viewing preview.
The complete source protocol remains separate pending the missing original inputs.
