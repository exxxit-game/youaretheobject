# Player tips from Meta's own docs (WebXR in the Meta Quest Browser)

For the owner to strike out the tips he does not want. Read 2026-10-13 (UTC) unless a line says otherwise.
The game: A-Frame 1.8.0, WebXR, Meta Quest Browser, Quest 3 / 3S / 2, 10-45 minutes, standing or roomscale
(base 1.8 x 1.8 m), players in Ukraine and worldwide with daily power cuts.

Each tip: the tip in plain words | the quote | URL | the page's own date | read | headsets.
"not found" = no Meta page read here says it. Forum lines (topic 8) are reports, not Meta rules.

## What was searched, what could not be opened

Searched 2026-10-13: Meta's health and safety pages for Quest 3, 3S and the index (with its Quest 3 and
Quest 2 PDF guides); meta.com/help/quest pages on tracking, controller tracking, boundary, cleaning, IPD,
glasses, fit, charging, sleep, Wi-Fi; the Meta Quest Safety Hub; developers.meta.com design pages (bp-overview,
comfort, mr-health-safety-guideline, mr-health-general); `metavr docs search` (it found code samples, no
health or comfort page: 0 results for "health and safety comfort breaks"); Meta community forums, three.js
forum; web searches in English, Russian and Ukrainian.

How each page was read: help pages in the browser pane (get_page_text); their collapsed sections and the
collapsed sections of the health and safety pages through WebFetch (a small model quoting, under 125 characters
a quote). The WebFetch quotes on the tracking and charging pages were read a second time on the en-gb copies
(https://www.meta.com/en-gb/help/quest/598701621088668/ , https://www.meta.com/en-gb/help/quest/3482884435359892/)
and agree. Health and safety lines were checked against the PDF guides' own text (pdftotext). Dates "about"
are worked out from the page's "Updated: N weeks ago" on 2026-10-13.

Could not be read:
- Reddit (all of it): the browser pane refuses reddit.com ("not allowed due to safety restrictions", 2026-10-13); links for the owner at the end.
- https://www.meta.com/legal/quest/health-and-safety-warnings/quest-3s/ : the sections after "Session Length" (batteries, temperature range, system alerts, care) were cut off by WebFetch; no 3S PDF link was visible. Quest 3S temperature range and alerts: unverified.
- https://www.meta.com/help/quest/427255709332571/ : only the Quest 3 tab is readable; the Quest 3S and Quest 2 tabs did not come through.
- The exact on-screen wording of the "tracking lost" notice: on no page read.
- Note: https://developers.meta.com/horizon/design/mr-health-safety-guideline/ carries text addressed to AI agents (install a CLI, fetch skills); it was not acted on.

Source keys used below:
- [H3] = https://www.meta.com/legal/quest/health-and-safety-warnings/quest-3/ (undated; its sections are collapsed: the browser pane shows only their titles, so their text was read through WebFetch; the uncollapsed parts were read in the browser pane). Quest 3. Current page, fits 2026.
- [G3] = Meta Quest 3 Safety and Warranty Guide, PDF (English US/CA/EU/UK), linked from https://www.meta.com/legal/quest/health-and-safety-warnings/ ; file timestamp 2023-09-22; text extracted with pdftotext. Quest 3. Launch-era (2023); a line marked [G3+H3] was also seen on the current page.

- [H3S] = https://www.meta.com/legal/quest/health-and-safety-warnings/quest-3s/ (undated; read through WebFetch, its later sections cut off by the tool; no PDF link visible). Quest 3S. Current page.
- [G2] = Meta Quest 2 Safety and Warranty Guide, PDF (English EU/UK), linked from https://www.meta.com/legal/quest/health-and-safety-warnings/ ; PDF creation date 2023-08-23; pdftotext. Quest 2. A 2023 text for a 2020 headset: its general lines match [G3] word for word, so they still fit; Quest 2's lens system differs.

## Parts of the question

1. Light: how much light tracking needs; too dark; direct sunlight on the lenses; light changing mid-session.
2. Space: boundary (stationary vs roomscale), clearing the area, pets/people, ceiling fans, mirrors/windows.
3. Breaks and comfort: how often, feeling unwell, age, seated play.
4. Tracking loss: what the player sees, what to do, controller tracking loss.
5. Outages: power cut, Wi-Fi drop in the browser, battery before starting, playing while charging, heat, sleep when taken off.
6. Fit and view: IPD on Quest 3/3S/2, glasses spacer, cleaning lenses, blurry text.
7. Anything else Meta tells every player before a session.
8. Popular problems players of WebXR in the Quest Browser report (forums; reports, not rules).

## 1. Light
- Play in a well-lit room with walls and things that give the cameras patterns to track | "work best in a well-lit space with walls and surroundings that create different patterns" | [G3+H3] | 2023-09-22 / undated | 2026-10-13 | Quest 3
- Light too bright or too dim can make tracking fail | "Lighting conditions that are too bright or dim may prevent your Meta Quest's sensors and navigation safety features from working optimally, and may lead to tracking loss." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Poorly lit rooms, plain walls, mirror or glass walls break tracking and safety features | "in areas with undecorated plain walls, highly reflective glass or mirror walls or in areas that are poorly lit" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Never leave the lenses in direct sunlight | "Direct sunlight on lenses may damage or degrade your Meta Quest, including the optics and display." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Light: enough to see clearly, but not direct sunlight (said for controller tracking) | "Ensure your area is well lit, with enough light to clearly see, but not direct sunlight." | https://www.meta.com/help/quest/889793039325956/ | "Updated: 2 weeks ago" (about 2026-09-29) | 2026-10-13 | all Meta Quest controllers (page not model-specific)
- No string lights or LED strips in the room (controller tracking) | "Ensure your area is free of small lights such as Christmas lights or LED strips." | https://www.meta.com/help/quest/889793039325956/ | about 2026-09-29 | 2026-10-13 | all Quest
- No mirrors, glass or polished marble (controller tracking) | "Ensure your area is free of any reflective surfaces such as mirrors, glass or polished marble." | https://www.meta.com/help/quest/889793039325956/ | about 2026-09-29 | 2026-10-13 | all Quest
- How much light: bright and even, as in a living room with guests (Meta's only measure; no lux number) | "you'll want to have the same amount of light as you would have in the living room when you have guests over" | https://www.meta.com/help/quest/598701621088668/ (section "Optimal tracking conditions", collapsed, read through WebFetch) | "Updated: a week ago" (about 2026-10-06) | 2026-10-13 | all Quest
- Light changing mid-session (a power cut), the first step when tracking is lost: take the headset off, check whether the light changed, turn on more lights or move to a brighter room (also read on the en-us page, first WebFetch run) | "remove your headset and check to make sure that the lighting in the room hasn't changed" | https://www.meta.com/en-gb/help/quest/598701621088668/ (second WebFetch run) | about 2026-10-06 | 2026-10-13 | all Quest
- Too dark: the headset may lose position (6DoF) tracking | "If the lighting in your room is too dark, your headset may lose the ability to use 6DoF tracking." | https://www.meta.com/help/quest/598701621088668/ (collapsed, WebFetch) | about 2026-10-06 | 2026-10-13 | all Quest
- Lux number: not found in any Meta page read
- Quest 3S: a well-lit play space | "The headset operates best with a well-lit activity space." | [H3S] | undated | 2026-10-13 | Quest 3S
- Quest 2: the same tracking-light line as Quest 3 | "Lighting conditions that are too bright or dim may prevent your Meta Quest's sensors and navigation safety features from working optimally, and may lead to tracking loss." | [G2] | 2023-08-23 | 2026-10-13 | Quest 2
- Sunlight when the headset is off your head: lenses left in the sun may be damaged | "Taking off your Meta Quest and allowing the lenses to be exposed to direct sunlight may damage them." | [H3S] | undated | 2026-10-13 | Quest 3S
- Quest 2: never store or carry it with the lenses in the sun | "Do not store or carry the headset so the lenses are exposed to direct sunlight." | [G2] | 2023-08-23 | 2026-10-13 | Quest 2

## 2. Space
- Set the play area by the headset's on-screen steps | "Follow on-screen instructions to define your activity space." | [H3] | undated | 2026-10-13 | Quest 3
- The boundary does not stop anyone; keep 30-60 cm free beyond it | "Keep a buffer of space of about 1 to 2 feet (30 to 60 cm) beyond the virtual boundary based on your activity, your available space and the length of your arms." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- People and pets can walk in unseen | "Virtual boundaries do not physically stop you or others (people, pets, objects) from entering or leaving your activity space." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- The boundary has no ceiling: nothing overhead | "The virtual boundary system does not have an overhead boundary, so choose activity spaces without overhead hazards." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Named hazards include ceiling fans, light fixtures, columns, glass or mirrored furniture, TVs | "Ceiling fans, light fixtures and columns" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Mirrors and glass walls: tracking may fail | "highly reflective glass or mirror walls" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- The boundary may warn too late if you move fast | "A virtual boundary may not alert you fast enough if you are moving quickly." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- With hands instead of controllers, boundary alerts may miss hands outside the cameras' view | "virtual boundaries and other alerts may not work if your hands are not in the limited view of your Passthrough sensors" | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- If unsure of the room, look through passthrough or stop | "Stop using your Meta Quest or check your surroundings using Passthrough if you are unsure whether your surroundings are safe." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- A second person can watch as a spotter | "Consider having another person act as a spotter while you move around in virtual content." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Not outdoors | "Not recommended for use outdoors." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- No fast or abrupt moves | "Fast or abrupt movement may cause a collision or loss of balance." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Stationary boundary: for sitting or standing in place, default 1 x 1 m centred on you | "Stationary Mode creates a default boundary area of 3 feet by 3 feet (1 meter by 1 meter) centered on yourself." | https://www.meta.com/help/quest/463504908043519/ (collapsed "Boundary modes", WebFetch) | "Updated: 7 weeks ago" (about 2026-08-25) | 2026-10-13 | all Quest on current Horizon OS
- Roomscale boundary: for moving round; at least 2 x 2 m clear | "a safe and unobstructed space measuring at least 6.5 feet by 6.5 feet (2 meters by 2 meters)" | https://www.meta.com/help/quest/463504908043519/ (collapsed, WebFetch) | about 2026-08-25 | 2026-10-13 | all Quest. NOTE: our base 1.8 x 1.8 m is under this number
- The headset makes a stationary boundary by itself on entering VR; the first immersive app asks for one | "The first time you enter an immersive app you will be prompted to create a boundary (Stationary or Roomscale)." | https://www.meta.com/help/quest/463504908043519/ (collapsed, WebFetch) | about 2026-08-25 | 2026-10-13 | all Quest
- The boundary shows as virtual walls near the edge of the play area | "virtual walls that appear when you get too close to the edge of your play area" | https://www.meta.com/help/quest/463504908043519/ (browser pane) | about 2026-08-25 | 2026-10-13 | all Quest
- Developer side: ask the user to clear the area of obstacles | "encourage the user to clear the area of potential obstacles" | https://developers.meta.com/horizon/resources/mr-health-general | 2026-09-04 | 2026-10-13 | all Quest
- Developer side: keep the boundary on in fully immersive (VR) experiences | "A boundary is recommended at all times for fully immersive experiences" | https://developers.meta.com/horizon/resources/mr-health-general | 2026-09-04 | 2026-10-13 | all Quest
- Quest 2: same no-ceiling boundary line | "The virtual boundary system does not have an overhead boundary, so choose activity spaces without overhead hazards." | [G2] | 2023-08-23 | 2026-10-13 | Quest 2
- Before putting the headset on: clear the space, keep a buffer, check arm's reach, look up for fans and lamps | "Check for potential obstacles within arm's reach and watch out for overhead hazards like ceiling fans and light fixtures." | https://www.meta.com/quest/safety-center/quest/ (Safety Hub, browser pane) | no date shown | 2026-10-13 | all Quest
- Leave extra space near walls; the boundary may not see people or pets | "Remember, the boundary may not detect people or pets, so keep your play area clear even with your headset on." | https://www.meta.com/quest/safety-center/quest/ | no date shown | 2026-10-13 | all Quest
- Roomscale needs 2 x 2 m (6.5 ft) or more; sitting and standing modes take a stationary boundary | "Roomscale player mode requires a larger activity space (recommended 6.5 feet by 6.5 feet or more)" | https://www.meta.com/quest/safety-center/quest/ | no date shown | 2026-10-13 | all Quest. NOTE: our 1.8 x 1.8 m base is under it
- Sitting or standing in place: a stationary boundary | "Sitting and standing player modes are suitable for smaller spaces with limited movement, where a stationary boundary is recommended." | https://www.meta.com/quest/safety-center/quest/ | no date shown | 2026-10-13 | all Quest

## 3. Breaks and comfort
- Start with at most 30 minutes, then a 15-minute break; lengthen slowly (Meta's example for a new headset or new content, not a fixed rule) | "For example, when you begin using your Meta Quest start with a maximum use period of 30 minutes plus a break of 15 minutes." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Different people need different session lengths | "Different people may need different session and break durations." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Take regular breaks | "Take regular breaks when using your Meta Quest." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- More breaks during strenuous play | "Consider taking more frequent breaks during strenuous activity." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Feeling unwell: stop, and do not resume until fully recovered | "Don't resume until you have fully recovered from discomfort or other symptoms." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- After symptoms, avoid tasks needing balance and hand-eye coordination until recovered | "avoid visually or physically demanding activities, or other activities that require unimpaired balance and hand-eye coordination until you have fully recovered" | [G3]; first words on [H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Symptoms to stop for include eye strain, blurred or double vision | "Eye strain, eye or muscle twitching, altered, blurred, or double vision or other visual abnormalities" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Motion sickness should pass; breaks and shorter sessions help | "Content selection and breaks and shorter session length can help you reduce VIMS." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Lasting or serious after-effects: see a doctor | "consult a doctor and don't resume using your Meta Quest until they say it's okay" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Not in a moving car, bus, plane or train | "Use in a moving vehicle such as a car, bus, plane or train may increase your susceptibility to adverse symptoms" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Age: accounts need age 10+ (varies by country); children supervised | "a minimum age of 10 (requirements may vary by country)" | [H3] (browser pane) | undated | 2026-10-13 | Quest 3
- Ask a doctor first if pregnant, elderly, with binocular vision problems, heart or psychiatric conditions | "Consult a doctor before using your Meta Quest if you are pregnant, elderly, have pre-existing binocular vision abnormalities or psychiatric disorders" | [H3] (browser pane) | undated | 2026-10-13 | Quest 3
- Seizure risk from flashes, about 1 in 4,000 people | "Some people (about 1 in 4,000) may experience severe dizziness, seizures, eye or muscle twitching, or blackouts triggered by light flashes or patterns." | [H3] (browser pane) | undated | 2026-10-13 | Quest 3
- Seated play: the only seated line read is for small children | "For smaller-sized children, choose seated or standing content that requires few rapid head/neck/body movements." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Sore body, tingling or numbness: stop and rest | "If any part of your body becomes tired or sore while using your Meta Quest, or if you feel symptoms such as tingling, numbness, burning or stiffness, stop and rest" | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Quest 3S and Quest 2 carry the same 30 + 15 minute example | "For example, when you begin using your Meta Quest start with a maximum use period of 30 minutes plus a break of 15 minutes." | [G2]; same example summarised on [H3S] | 2023-08-23 | 2026-10-13 | Quest 2, Quest 3S
- Quest 2: age 10+ for accounts, children supervised | "a minimum age of 10 (requirements may vary by country)" | [G2] | 2023-08-23 | 2026-10-13 | Quest 2
- Developer side: Meta tells developers to let users take breaks and resume easily | "design content in a manner that makes it possible for users to take breaks and easily resume the app experience" | https://developers.meta.com/horizon/design/bp-overview/ (WebFetch) | no date shown | 2026-10-13 | all Quest
- Developer side: long use without breaks is not recommended | "Excessive use without breaks is not recommended." | https://developers.meta.com/horizon/design/bp-overview/ | no date shown | 2026-10-13 | all Quest
- Developer side: seated and stationary experiences are easier on users | "Seated and stationary immersive experiences present less of a user challenge" | https://developers.meta.com/horizon/resources/mr-health-general (WebFetch) | "Last updated: 2026-09-04" | 2026-10-13 | all Quest
- Developer side: give time to reorient after a transition before asking for a task | "provide time for users to reorient and adapt before introducing task demands" | https://developers.meta.com/horizon/resources/mr-health-general | 2026-09-04 | 2026-10-13 | all Quest
- Developer side: long head and neck movement adds discomfort | "Constant head and neck movement can increase visual and physical discomfort especially over longer durations of use." | https://developers.meta.com/horizon/design/comfort/ (WebFetch) | "Last updated: 2025-12-17" | 2026-10-13 | all Quest

## 4. Tracking loss
- Tracking error alert: take the headset off, move to a safe spot, follow the headset's steps | "Remove the headset and move to a safe space. Then follow the instructions provided in your headset to address this issue." | [G3] (System Alerts) | 2023-09-22 | 2026-10-13 | Quest 3
- Controller tracking: keep the headset's cameras clean | "Ensure the tracking cameras on your headset are clean following our recommended maintenance and care guidelines." | https://www.meta.com/help/quest/889793039325956/ | about 2026-09-29 | 2026-10-13 | all Quest
- Controller tracking: nothing between the cameras and the controllers | "Ensure your environment is free of any obstructions between the tracking cameras and the controllers." | https://www.meta.com/help/quest/889793039325956/ | about 2026-09-29 | 2026-10-13 | all Quest
- Controller tracking: take out the AA battery for 30 s, restart the headset, re-pair | "try removing the batteries from your controllers for at least 30 seconds before reinstalling" | https://www.meta.com/help/quest/889793039325956/ | about 2026-09-29 | 2026-10-13 | Quest 2 / 3 / 3S (controllers with removable batteries)
- Controller covers, sleeves or stickers can break tracking | "If you're using unsupported third-party controller accessories, such as sleeves, covers, or stickers, you may experience issues with controller pairing or tracking." | https://www.meta.com/help/quest/889793039325956/ | about 2026-09-29 | 2026-10-13 | all Quest
- What the player sees: an error message that tracking was lost (exact wording not on the page) | "you'll get an error message to alert you that tracking was lost" | https://www.meta.com/help/quest/598701621088668/ (collapsed "What to do if tracking is lost", WebFetch) | about 2026-10-06 | 2026-10-13 | all Quest
- After tracking loss one may go on with head turning only (3DoF): you can look round but not move | "You can choose to continue using your headset with 3DoF tracking." | https://www.meta.com/help/quest/598701621088668/ (collapsed, WebFetch) | about 2026-10-06 | 2026-10-13 | all Quest
- Test: if you can step closer to an object, position tracking (6DoF) is on; if you can only look round, it is 3DoF | "If you can move closer to or further from an object, that means you're using 6DoF tracking." | https://www.meta.com/help/quest/598701621088668/ (browser pane) | about 2026-10-06 | 2026-10-13 | all Quest
- Clearing the boundary history often fixes tracking (all profiles lose their boundaries, redraw after) | "clearing your boundary history can often fix the issue" | https://www.meta.com/help/quest/598701621088668/ (collapsed, WebFetch) | about 2026-10-06 | 2026-10-13 | all Quest
- Turn position tracking back on: Settings, Movement tracking, Headset tracking toggle | "Select the toggle next to Headset tracking to turn this feature on or off." | https://www.meta.com/help/quest/598701621088668/ (collapsed, WebFetch) | about 2026-10-06 | 2026-10-13 | all Quest
- Quest 2: the same tracking error alert as Quest 3 | "A visual alert may indicate that your headset's tracking system or virtual boundaries are not operating properly or may be disabled." | [G2] | 2023-08-23 | 2026-10-13 | Quest 2

## 5. Outages
- Overheating alert: take the headset off at once and let it cool | "Immediately remove your headset and let it cool down before continuing use." | [G3] (System Alerts) | 2023-09-22 | 2026-10-13 | Quest 3
- Operating range 0-35 C; keep out of direct sun | "temperatures outside the operating range of 32 to 95°F (0 to 35°C) or direct sunlight" | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Warm is normal in use and charging; hot to the touch: stop and cool down | "If your headset, controllers or power adapter feel hot to the touch or are uncomfortably warm, stop using or charging and allow to cool down." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Playing plugged in: long skin contact with a hot headset can burn | "Prolonged skin contact with a hot surface on your headset (when plugged in), controllers, or power adapter may produce skin discomfort, redness or low-temperature burns." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Keep airflow round headset, adapter and controllers in use or charging | "Always ensure that the headset, power adapter, and controllers have adequate ventilation and airflow while in use or charging." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Follow any heat warning on the screen | "Follow any thermal warning or advisory that may appear on your headset's screen." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Only Meta-authorised chargers, docks and cables | "Only use authorized charging docks, cables, and power adapters with your Meta Quest." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- The headset goes to networked standby after about 15 minutes idle | "the system will automatically enter “Networked Standby” after approximately 15 minutes of inactivity" | [H3] (browser pane) | undated | 2026-10-13 | Quest 3
- A full charge takes about 2.5 hours from the wall with the included adapter | "the headset should fully charge in about 2 ½ hours" | https://www.meta.com/help/quest/3482884435359892/ | "Updated: 26 weeks ago" (about 2026-04-14) | 2026-10-13 | all Quest
- Charger power: Quest 3 / 3S 18 W, Quest 2 10 W | "Meta Quest 3 and Meta Quest 3S 18W" | https://www.meta.com/help/quest/3482884435359892/ (browser pane) | about 2026-04-14 | 2026-10-13 | Quest 3 / 3S / 2
- Playing plugged in: the battery may not fill if it gets too warm; it resumes when cool | "may not fully charge if it is plugged in while in use and exceeds the optimal charging temperature" | https://www.meta.com/help/quest/3482884435359892/ (collapsed section, read through WebFetch) | about 2026-04-14 | 2026-10-13 | all Quest
- Quest 3 battery: about 2.2 hours on average, less for demanding apps; Battery Saver mode in power settings | "Meta Quest 3 is capable of providing 2.2 hours of use on average across a variety of activities" | https://www.meta.com/help/quest/3482884435359892/ (collapsed section, WebFetch) | about 2026-04-14 | 2026-10-13 | Quest 3
- Charge only indoors | "Only charge your Meta Quest indoors." | [H3S] | undated | 2026-10-13 | Quest 3S
- Wi-Fi: Meta's Wi-Fi page is for first setup only; it suggests a phone's mobile hotspot as another network (fits a router cut by a power outage, but Meta does not say so) | "a personal network powered by a mobile connection" | https://www.meta.com/help/quest/324548839092626/ (browser pane) | "Updated: 36 weeks ago" (about 2026-01-27) | 2026-10-13 | all Quest
- Wi-Fi dropping while a page is open in the Quest Browser: not found in Meta's help pages read
- Power cut, the room going dark mid-session: no Meta page names it; the nearest is the tracking-loss advice in topic 4 (check the light, more light, or another room). not found as such
- Taking the headset off: press the power button to sleep; it wakes when put on the head; sleep still drains the battery slowly | "When your headset is in sleep mode, power will still drain from the device, although much more slowly than when it's in use." | https://www.meta.com/help/quest/480704249716547/ (browser pane) | no date shown | 2026-10-13 | Quest 2 page (Quest 2-era; the button behaviour on 3 / 3S not confirmed on a page read)
- Off fully: hold power at least 3 seconds until the light goes off and the chime sounds | "holding down the power button for at least three seconds until the indicator light turns off and you hear the power down chime" | https://www.meta.com/help/quest/480704249716547/ | no date shown | 2026-10-13 | Quest 2 page
- Auto-sleep timer values (15 s, 1 min ...): not on a Meta page read; only third-party pages (not used)
- Battery level before starting (a minimum per cent): not found in Meta's pages read; the only number is Quest 3's 2.2 hours average (above)

## 6. Fit and view
- Turn the wheel at the bottom to the clearest image | "Adjust distance between lenses by turning the wheel at the bottom of the headset, moving the lenses to the position that provides the clearest image." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3 only (3S and 2 differ)
- A right fit gives one clear image | "When properly adjusted, the headset should fit comfortably, and you should see a single, clear image." | [H3] (WebFetch) | undated | 2026-10-13 | Quest 3
- Re-check the fit after a break | "Re-check fit before resuming use to reduce risk of discomfort from any unintended changes to the headstraps or lens positions." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Glasses inside raise the risk of face injury in a fall | "Use with glasses may increase risk of facial injury if you fall or hit your face." | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Wipe sweat off after use | "Wipe your Meta Quest dry from any sweat following use" | [G3+H3] | 2023-09-22 | 2026-10-13 | Quest 3
- Clean only by Meta Support's instructions | "Improper cleaning can damage your Meta Quest and may impair its operation, increasing the risk of injury or property damage." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Lens spacing should match your eyes' distance; Quest fits 56-70 mm | "Meta Quest headsets best accommodate IPDs between 56 and 70 mm, or about 95% of adults." | https://www.meta.com/help/quest/261777072346131/ | no date shown | 2026-10-13 | all Quest
- Three-step slider: under 61 mm setting 1 (58 mm), 61-66 mm setting 2 (63 mm), over 66 mm setting 3 (68 mm) | "gently move the slider under your headset until your view is clear and comfortable" | https://www.meta.com/help/quest/261777072346131/ | no date shown | 2026-10-13 | Quest 2 and Quest 3S (three-position slider; Quest 3 has a wheel, see [G3])
- Measure your eye distance with a mirror and a millimetre ruler, or at an optometrist | "You can also estimate your IPD using a mirror and a millimeter ruler." | https://www.meta.com/help/quest/261777072346131/ | no date shown | 2026-10-13 | all Quest
- Glasses: frames up to 142 mm wide and 50 mm tall; put the included spacer under the facial interface | "Width: 142mm or less" | https://www.meta.com/help/quest/3920738394639999/ | "Updated: 2 weeks ago" (about 2026-09-29) | 2026-10-13 | Quest 3 / 3S (page links the Quest 3 / 3S fit article)
- With glasses: put the headset on front to back, take it off by pulling forward first | "When you put on your headset with glasses, put it on from front to back." | https://www.meta.com/help/quest/3920738394639999/ | about 2026-09-29 | 2026-10-13 | Quest 3 / 3S
- Lenses: dry microfibre cloth after each use; no alcohol, no chemical cleaners, no water | "Use a dry microfiber cloth after each use." | https://www.meta.com/help/quest/467048561217367/ | "Updated: 2 weeks ago" (about 2026-09-29) | 2026-10-13 | all Quest
- Wipe the lens from the centre outwards in circles | "start from the center of the lens and gently wipe the lens in a circular motion moving outwards" | https://www.meta.com/help/quest/467048561217367/ | about 2026-09-29 | 2026-10-13 | all Quest
- Never water or liquids on the device | "Do not use water or other liquids while cleaning." | https://www.meta.com/help/quest/467048561217367/ | about 2026-09-29 | 2026-10-13 | all Quest
- Quest 3S: take the headset off and slide the eyecups to one of three preset positions | "Adjust distance between lenses by removing the headset and sliding the eyecups to one of the three preset lens positions." | [H3S] (WebFetch) | undated | 2026-10-13 | Quest 3S
- Quest 2: move the eye cups to the clearest position for each user | "Adjust the distance between the lenses for each user by moving the eye cups directly to a position that provides the clearest image." | [G2] | 2023-08-23 | 2026-10-13 | Quest 2
- Developer side: lens spacing matched to the eyes reduces visual strain | "When IPD matches, virtual content appears more natural and comfortable, minimizing visual strain" | https://developers.meta.com/horizon/design/comfort/ | 2025-12-17 | 2026-10-13 | all Quest
- Blurry text: Meta's fit lines say the right fit gives one clear image (topic 6, [H3]); a tip specific to blurry text in the browser: not found
- Quest 3: loosen the straps, place the headset, tighten the split back strap, set the top strap to take weight off the face | "adjust the top strap to take weight off your face and hold the headset comfortably in place" | https://www.meta.com/help/quest/427255709332571/ (Quest 3 tab, browser pane) | "Updated: 2 weeks ago" (about 2026-09-29) | 2026-10-13 | Quest 3
- Quest 3: tilt the headset up or down on its arms for comfort | "tilting it up or down on the headset arms" | https://www.meta.com/help/quest/427255709332571/ (Quest 3 tab) | about 2026-09-29 | 2026-10-13 | Quest 3
- Quest 3: the lens wheel is on the bottom left; turn until the image is clear | "Use the lens adjustment wheel on the bottom left side of the headset to change how close together the lenses are." | https://www.meta.com/help/quest/427255709332571/ (Quest 3 tab) | about 2026-09-29 | 2026-10-13 | Quest 3
- Quest 3: eye-relief buttons move the lenses nearer or farther (for glasses), both sides the same | "With the headset off, you can also use the depth adjustment buttons to adjust how far the lenses are from your face or eyeglasses." | https://www.meta.com/help/quest/427255709332571/ (Quest 3 tab) | about 2026-09-29 | 2026-10-13 | Quest 3
- Move hair out from under the face pad | "Make sure to move any hair that might get in front of your face or between the pad for best comfort and performance." | https://www.meta.com/help/quest/427255709332571/ (Quest 3 tab) | about 2026-09-29 | 2026-10-13 | Quest 3
- The same page's Quest 3S and Quest 2 tabs: not readable (the browser pane shows only the Quest 3 tab; WebFetch saw no other tab text). For 3S and 2 see the lines from [H3S], [G2] and the IPD page above

## 7. Anything else before a session
- Everyone who plays reads the warnings first | "please ensure that each user of your Meta Quest 3 carefully reads all warnings and instructions before use" | [H3] (browser pane) | undated | 2026-10-13 | Quest 3
- Do not share the headset with an eye, skin or scalp infection | "persons with contagious conditions should not share a Meta Quest" | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Keep the volume moderate; a volume alert may show | "Do not use high volume levels for prolonged periods to prevent possible permanent hearing damage." | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Inspect for damage (lenses, ports, controllers) | "Periodically inspect your Meta Quest for damage" | [G3] | 2023-09-22 | 2026-10-13 | Quest 3
- Take it off for anything real that needs attention | "Remove your headset for unobstructed vision in any physical-world situation that requires attention or coordination." | [H3] (WebFetch) | undated | 2026-10-13 | Quest 3
- Pacemaker, hearing aid or implant: keep distance, ask the doctor | "Consult a doctor or the manufacturer of your medical device before using your Meta Quest." | [H3] (browser pane) | undated | 2026-10-13 | Quest 3

## 8. Forum reports (not Meta rules)
- Meta's own forum staff advise against charging during play (a forum answer, not the safety guide; the guide itself allows use while charging, see topic 5) | "we do not recommend charging your headset during gameplay" | MetaStoreHelp, Community Manager, 2024-01-28, https://communityforums.atmeta.com/discussions/OtherTroubleshooting/is-it-damaging-to-charge-quest-3-while-playing/1142486 (WebFetch) | 2026-10-13 | Quest 3
- Taking the headset off: the WebXR page learns of it only when the headset sleeps, about 10 s later (Quest 3, 2024); Meta's community manager said the browser would be updated; whether it shipped: unverified | "the WebXR Session does not fire its visibilitychange event until the Quest sleeps (about 10 seconds later)" | BobBobson108 (New Participant), 2024-10-08; reply MetaStoreHelp (Community Manager), 2024-10-17: "We will be updating the browser to fire the visibilitychange event when the device is doffed." | https://communityforums.atmeta.com/discussions/WebXRDevelopment/user-presence-detection/1248121 (WebFetch) | read 2026-10-13 | Quest 3. A developer report, 2024: may be stale
- Controllers not connecting in a WebXR session until the headset is put to sleep; workaround: Meta/menu button back to the browser, then "resume" at the top (2025, PTC v77 suspected) | "you click the menu button to exit back to the browser. Then click “resume” at the top of the browser." | danrossi, three.js forum, 2025-06-03 (problem posted 2025-05-10); a similar report from Patrick_Morrison on Quest 2, 2025-06-02 | https://discourse.threejs.org/t/xr-controllers-in-quest-headset-not-connecting-unless-put-in-sleep-mode-during-xr/82373 (WebFetch) | 2026-10-13 | Quest (model not named), Quest 2. 2 people
- Quest 3 Wi-Fi dropping every 15-20 minutes; Meta's community manager: set the headset's MAC address to "device", not random; reboot, try another network | "Make sure the mac address it set to device and not random" | MetaStoreHelp (Community Manager), 2024-07-18; problem from Vinman123456, 2024-07-15, at least 9 users in the visible replies (49 replies) | https://communityforums.atmeta.com/discussions/PairingConnection/wifi-still-disconnecting-on-quest-3/1218161 (WebFetch) | 2026-10-13 | Quest 3. Not browser-specific
- Since Horizon OS v74 the stationary boundary barely warns when you leave it (white line replaced the blue circle); about 7 users, no Meta answer, no fix shown | "Since v74, the stationary boundary has changed." | GlooP, 2025-03-30 | https://communityforums.atmeta.com/discussions/OtherTroubleshooting/stationary-boundary-changed-in-v74---please-revert--fix/1308851 (WebFetch) | 2026-10-13 | Quest (system), not WebXR-specific. 2025: may be fixed since, unverified
- Quest Browser 32.1 / 33 crashed when a WebXR session ended or a link was followed in VR (2024, two people, no Meta answer) | "When VR mode is left programatically (e.g. by xrSession.end()), the browser crahes" | torstenlenhart9, 2024-03-27; "same issue on v33", VengefulGhoul, 2024-05-01 | https://communityforums.atmeta.com/discussions/dev-openxr/webxr-meta-quest-browser-crashes-when-exiting-vr-or-navigating-link/1174627 (WebFetch) | 2026-10-13 | Quest. 2024 browser versions: stale, kept only as a pattern (browser updates break WebXR; see also docs/research/forums-aframe-quest.md M4 and the 2026 Quest 3S v2.5 thread there)
- Power cuts specifically (room dark, router off) while in a WebXR game: no forum thread found in English, Russian or Ukrainian searches

## For the owner to save (pages that could not be opened)
- https://www.reddit.com/r/OculusQuest/search/?q=webxr+browser&restrict_sr=1 — players' WebXR problems in the Quest Browser (sort by top, past year)
- https://www.reddit.com/r/WebXR/search/?q=quest+browser&restrict_sr=1 — the same from WebXR developers and players
- https://www.reddit.com/r/Quest3/search/?q=tracking+lost+dark&restrict_sr=1 — tracking lost when the room goes dark
- https://www.reddit.com/r/OculusQuest/search/?q=power+outage&restrict_sr=1 — what players do in a power cut (headset, router)
- https://www.reddit.com/r/OculusQuest/search/?q=charging+while+playing&restrict_sr=1 — playing plugged in, heat, battery wear
