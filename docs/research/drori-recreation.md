# Drori 2020: source check before the second sample

18 October 2026. Read-only source investigation at 4bf0071 on codex/trial-migration.
No second room, shortened protocol or substitute candidate implemented.
The owner explicitly rejected changing the experiment to make a short demonstration.
Owner clarification: if a concrete source parameter cannot be found, name it plainly;
do not replace it with an invented value or an unexplained subset. For 02-lines,
the reduction from twelve variants to two was the assistant's choice, not missing source.

## Sources actually obtained

- Primary article: Drori et al., JCM 9(6):1627, DOI 10.3390/jcm9061627.
  Existing local drori-2020 PDF/text, Methods pp. 4-6, Results pp. 7-10,
  Discussion and limitations pp. 10-12 read. Structured article retrieved independently:
  https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7355917/fullTextXML .
- Supplement obtained successfully from Europe PMC, not the publisher's blocked page:
  https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7355917/supplementaryFiles .
  ZIP contains jcm-09-01627-s001.pdf (543553 bytes) and three article figures.
  Supplement text read; Figure S1 on PDF p. 2 rendered and inspected.
  Local acquisition and extraction evidence is under ignored node_modules/.cache/drori-source/.
- Official project https://salomonlab.org/unreal/ links the 2020 article and the
  same group's 2025 follow-up. No 2020 program/configuration link found there.
- Follow-up DOI 10.1101/2025.04.07.647542, author-linked public manuscript retrieved.
  Only the relevant psychophysics methods were checked: 1-up/1-down and 5.2 s phases,
  with a further detailed supplement referenced. These differ from 2020; this is not
  a source for silently filling the older protocol's gaps. No full reading or
  independent-replication audit of the 2025 work is claimed.
- Targeted public web and GitHub repository searches for UnReal + Drori / Salomon
  found no usable 2020 program. This bounded search does not prove none exists.

## What the retrieved material establishes

| Item | Verified source |
|---|---|
| Stationary point, free observation around the room; Experiment 1 posture unspecified | Main pp. 4-5; standing is explicit only for Experiment 2 p. 6 |
| HTC Vive, furnished apartment with animated cat; dimensions 13.2 x 24.7 x 3.36 Unity units | Main pp. 4-5 |
| Six aspects: grain, roll, stretch, narrow, grow, shrink | Main p. 5 |
| First view 2 s, black 1 s, second view 2 s, same/different response | Main p. 5 |
| Four runs of each aspect: 24 randomly interleaved staircases | Main p. 5 |
| Method calls the rule 1-up/2-down and states a 40% change of current alteration | Main p. 5 |
| Training until acclimated, at most 26 trials | Main p. 5 |
| JND calculated from the last five trials per staircase | Main p. 6 |
| Stretch/narrow: scale X only, baseline T=1, pivot on floor | Supplement pp. 1-2 |
| Grow/shrink: position within floor-to-ceiling interval, baseline 50%, example grow level 1 at 60% | Supplement p. 1 |
| Grain: Unity Post Process Stack 2.1.6; size 3, luminance contribution 0, variable intensity with baseline 0 | Supplement p. 1 |
| Condition called roll: printed Rotate uses negative T about Vector3.right, local space | Supplement p. 1 |

The supplement's grow/shrink description uses the room-height interval, not simply
a percentage of the actual participant's eye height. Its roll function specifies the
Unity X axis; a WebXR port must check coordinate mapping rather than assume a Z roll.
The independent display environment and calibrated device behavior also need verification;
reusing a lab shell does not by itself reproduce the apartment's perceptual thresholds.

## Still missing or ambiguous, not filled with guesses

1. Initial magnitude for each of the six staircases and permitted parameter bounds.
2. Exact staircase completion rule: fixed step count, reversals or convergence criterion.
   The reported convergence statistics do not specify this algorithm.
3. Exact response-update rule. The phrase 1-up/2-down ordinarily requires two consecutive
   detections before a decrease, but the next sentence describes a decrease after a
   different response. The prose alone does not resolve implementation details.
4. Allocation of altered view to first/second position, and whether any no-change controls
   existed in Experiment 1. The description states one view was altered in each pair;
   adding identical controls would change the documented procedure.
5. Exact numeric levels of Experiment 2 and original 2020 configuration/code.
   Figure S1 illustrates levels; it does not provide the missing numeric configuration.
6. Total participant time: not stated. The earlier 5-8 minute claim was an estimate
   for a reduced procedure, not an observed duration of the published experiment.

These are implementation inputs, not details the owner should invent or debug.
There is no runnable source-faithful second room yet. Its short-duration and
scientific-equivalence claims must not be made. The prior twelve-fixed-pair proposal
remains withdrawn. No camera roll, height shift or new physical activity is introduced.

## Deeper Chrome follow-up

The owner explicitly requested Chrome and asked whether these parameters are universal
constants or choices we should make. The publisher opened successfully in ordinary
Chrome; no owner login/CAPTCHA or additional plugin was needed. The same supplementary
PDF is listed. [Version notes](https://www.mdpi.com/2077-0383/9/6/1627/notes)
show an updated record PDF on 4 June 2020 and later HTML updates; the notes alone do
not establish changed methods or supply the missing staircase configuration.

Following the official lab's links in Chrome, obtained the 2025 v1 supplementary PDF:
https://www.biorxiv.org/content/10.1101/2025.04.07.647542v1.supplementary-material .
The download is media-1.pdf, 1577533 bytes, 13 pages, saved by Chrome in Downloads;
extracted text is in the existing ignored source evidence directory. Its detailed
staircase section on p. 3 specifies nine conditions, 5.2 s phases with 0.5 s blank,
1-up/1-down, three introductory extreme trials, stopping after five reversals or
25 trials, plus individual curve-fitting/repeat criteria. These are concrete settings
for the later study, not evidence that the same values were used in 2020.

Chrome's version history led to v3, posted 9 November 2025. Its full text:
https://www.biorxiv.org/content/10.1101/2025.04.07.647542v3.full-text .
The data-availability statement points to https://github.com/SLabhaifa . This is a
new source beyond the earlier bounded name search. The lab has a public repository:
https://github.com/SLabhaifa/psych_gady . Inspected its full Git tree at immutable
46b420e6c52e0679aca0eb614d915f73a8033a33 and downloaded only method files:
three R scripts and a Hebrew operator-instruction DOCX, not participant datasets.
There are 675 files and zero C# files in that snapshot. The top-level README is
only a title. Four commits span October 2023 to January 2024; the final substantive
commit refers to a Wonderland correction and fMRI changes.

The method scripts use nine later conditions including delay, gravity, speed,
saturation and ripple, unlike the six conditions of 2020. The operator instructions
discuss fit acceptance, repeats and changing the starting step when detection fails;
they explicitly explain that the initial staircase value influences the final result.
They do not supply the missing complete 2020 task configuration. No acquired R code
or author-provided software was executed. Evidence: ignored drori-source/lab-method/.

Further branch inspection found a concrete configuration beyond the main snapshot:
open PR1, branch added-here-package-and-loading-function, head
821b5b94b4fbdc4b8cd5a023ddba4ee757735ec9, updated 7 April 2024.
Two actual command tables were retrieved and read under
unreal_psychophysics/Experiment/UnrealData/Plans/Unreal/:
StaircaseCommands.csv and StaircaseCommands_Gadi.csv. Their columns include initial
value, positive/negative update operators and factors, response counts, manipulated
phase, flipBreakLimit and bounds flags. Observed factors include 0.7/0.8 and the
two tables have different initial values. The tables therefore close the generic
question of whether any author configuration is publicly available: yes, some is.
They do not establish which settings produced the six-aspect 2020 result; no Unity
runtime or complete parameter-to-condition mapping for that study is established.
Do not describe them as the missing verified 2020 configuration. The file itself
was also opened and its table verified in ordinary Chrome:
https://github.com/SLabhaifa/psych_gady/blob/821b5b94b4fbdc4b8cd5a023ddba4ee757735ec9/unreal_psychophysics/Experiment/UnrealData/Plans/Unreal/StaircaseCommands.csv .

General primary-method documentation checked separately:
https://psychopy.org/api/data.html#psychopy.data.StairHandler . It exposes initial
value, step size, response rule, bounds and stopping parameters as explicit experiment
settings. This supports distinguishing design choices from universal constants;
it does NOT mean the Unity study used PsychoPy, its defaults or its stopping rule.

Conclusion: the parameters are experiment settings, not universal constants. An
adaptation can choose and pilot its own declared parameters, but those
choices define a new version of the procedure and do not reconstruct the missing
2020 settings. Choosing them requires resolving the owner's intended fidelity, not
quietly installing defaults. Exact 2020 initial values and completion rule remain open.
No room code changed. Access is no longer the blocker; missing original configuration is.

## Concrete continuation

Obtain the 2020 task configuration or clarification from the authors, then complete
the source mapping and protocol before implementation. Do not substitute the 2025
method, manufacture a stopping rule, silently skip to candidate three or ask the
owner to evaluate a different protocol as the original.

The following request is prepared but NOT sent; contacting another person requires
the owner's explicit authorization. No player records or private project material
are needed for that request.
An editable mail draft is [drori-author-request.eml](drori-author-request.eml).
No message has been sent. An author reply, availability or response time is not guaranteed.

Subject: Reproducing the UnReal 2020 Experiment 1 procedure

Corresponding author listed on the primary article's first page: Gad Drori,
gadidrori@gmail.com. This is the published contact, not a verified current inbox.

Dear Dr Drori and colleagues,

I am working on a source-faithful WebXR recreation of the paired-view task in your
2020 UnReal article (10.3390/jcm9061627). I have read the article and supplement.
Could you please point me to the original task code/configuration or clarify:

- The starting values and bounds for each alteration in Experiment 1.
- The exact staircase stopping criterion and whether decreasing intensity required
  two consecutive different responses, as suggested by 1-up/2-down.
- Whether baseline/altered view order was randomized, and whether identical pairs occurred.
- The numeric manipulation levels and typical participant duration.

I do not want to replace unspecified values with assumptions or claim that a modified
short task reproduces your procedure. Any publicly shareable configuration or methods
description would be very helpful. Thank you.
