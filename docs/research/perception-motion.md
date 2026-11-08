# Moving patterns and the observer

Research update, 7 November 2026. Read with `docs/research/perception-corridor.md`.
The owner adds motion-dependent depth and intentional double-image viewing to the
existing purpose; this extends the connected corridor design.

## Evidence and reproducibility

Reference: https://www.youtube.com/watch?v=9o8SyXH0vVo . The prepared Chrome tab
and transcript were reused. A public video-only track was acquired for analysis.
The single source, inspection frames, measurements and Russian report are under
`F:/AI/work/perception-video-9o8SyXH0vVo`. Its manifest identifies file/hash and method.
No extracted artwork or soundtrack has been added to the game.

The available track is 480 by 360, 30000/1001 fps, duration 1792.757633 s.
180 samples every 300 source frames cover 0 to 1791.79 s in nine inspection sheets.
All nine sheets were reviewed across three readers. Three intervals were sampled
more densely: 10:48-11:14, 14:18-14:53 and 28:30-29:15. The full source was not
watched frame by frame; unique original pictures were not counted or reconstructed.

| Interval | Source observation |
|---|---|
| 10:49-11:11 | One blue square changes angle and size. |
| Around 14:33 | A sector wipe replaces a radial flower with a spiral variant. |
| 28:30 onward | A final flower persists across sampled views, with rotation and size changes. |

The wipe is an encoded image change, not evidence of an observer-induced deformation.
Native browser playback of the first interval was also inspected, with buffering
present. Local frames avoid mistaking player overlays for image content.

FFmpeg vidstab sampled local motion at 5 fps across the source, producing 8964
frame records. A robust similarity fit yielded 8962 usable numerical rows. Six
selected intervals had median apparent global rotation near 14.6 degrees/s.
Scale estimates varied on both sides of unity. This supports physical rotation
and resizing in those intervals, not a recovered 3D camera or a perceptual effect.
The fitter was calibrated on a known 2-degree, 1.01-scale field; video estimates
remain approximate because of matching errors, cropping and montage transitions.

## Distinct processes to investigate

1. Encoded changes: picture rotation, size, montage and replacement of one pattern.
2. Perceived depth during motion, including a possible stereokinetic interpretation.
3. A motion aftereffect when observing stationary surroundings after moving patterns.
4. Intentional viewing of two copies and their reportedly different motion percepts.

The owner reports the last two directly. No eye tracking, controlled presentation,
vergence measurement or individual perceptual test has established their mechanism.
Accommodation, vergence, fusion, diplopia and binocular rivalry are distinct terms.
Two copies alone do not establish binocular rivalry. Digital temporal aliasing and
perceptual reversal must also remain distinct possibilities when interpreting motion.

## Primary sources and reading limits

- Rokers, Yuille and Liu (2006), *The perceived motion of a stereokinetic stimulus*,
  Vision Research 46, 2375-2387, https://doi.org/10.1016/j.visres.2006.01.032 .
  Full text read by the source reviewer, introduction and methods independently checked.
  A rotating planar ellipse supported different 2D/3D percepts. The two experiments
  had 11 and 28 participants; two participants overlapped. Viewing conditions and
  familiarisation differ from the owner's complex images and a two-eye Quest scene.
  Author PDF: https://www.cs.jhu.edu/~ayuille/pubs/ucla/A200_brokers_VISRES2006.pdf .
- Zanforlin and Vallortigara (1988), *Depth effect from a rotating line of constant
  length*, https://doi.org/10.3758/BF03210435 . Introduction, methods and results
  reviewed. Four experienced observers; a small prepared sample. Rotation of a
  planar line can appear tilted in depth. It does not verify all patterns here.
- Laeng, Nabil and Kitaoka (2024), *Tunnel motion*,
  https://journals.sagepub.com/doi/10.1177/03010066241270493 . Methods and discussion
  read by the reviewer, introduction independently checked. 44 participants; pupil
  responses were central measures. Expanding controls did not all evoke equal depth.
  An increasing image scale or a pupil response is not itself a measured tunnel.
- Snowden and Milne (1996), *The effects of adapting to complex motions*,
  https://doi.org/10.1162/jocn.1996.8.5.435 . Methods, results and limitations read.
  Selective adaptation to rotation, expansion and spiral motions affected motion
  thresholds. Informal reports of stationary-field motion were identified separately.
  PDF: https://orca.cardiff.ac.uk/id/eprint/33884/1/Snowden%201996.pdf .
- Snowden and Milne (1997), https://pubmed.ncbi.nlm.nih.gov/9368753/ , and Bex,
  Metha and Makous (1999), https://pubmed.ncbi.nlm.nih.gov/10343804/ : abstracts
  reviewed, full texts not obtained here. These concern controlled motion aftereffects,
  including effects outside the directly adapted field; they do not diagnose this case.
- Georgeson and Wallis (2014), *Binocular fusion, suppression and diplopia for blurred
  edges*, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4312971/ . Methods, model and
  conclusions read. Controlled blurred edges distinguish fusion, suppression and
  diplopia. This is not an experiment on the owner's rotating pictures.
- Kline, Holcombe and Eagleman (2004), https://doi.org/10.1016/j.visres.2004.05.030 .
  Full six-page paper reviewed. Motion interpretations of a drum and its mirror
  image could reverse separately. This does not explain voluntary diplopia. Its
  motion-rivalry account is not interchangeable with binocular rivalry. Later
  follow-up https://doi.org/10.1167/8.4.13 was located; this is not a full history audit.

## Geometric illustration requested by the owner

The inline illustration draws two explicit copies of one inspected frame. It uses
manual affine sampling of the square, separation, rotation direction, shape clipping
and alpha compositing. The two copies and transparency are parameters of the drawing,
not measured retinal images, fusion or a reproduction of what the owner sees.
It starts paused and stops at the current angle. An individual copy can be shown.
The geometry and controls were checked in Chrome at widths 736 and 320; the original
viewport was restored. Native input, play/pause and shape/copy selectors were checked.

## Consequence for the corridor

Preserve the same object and route while comparing static appearance, motion,
stopping and returning. Proposed conditions separate uniform texture rotation,
scale change, a genuine geometry/viewpoint change and the observation history.
The owner's two-copy arrangement supplies an additional composition idea; it does
not require the player to induce double vision. Ordinary head tracking is retained.
Frame rate, image size, viewing distance, contrast and binocular presentation must
be recorded before comparing desktop, phone and Quest observations. The desired
spiritual meaning remains the owner's authorial purpose; these tests measure only
their defined visual observations. No new game implementation or release is claimed.
