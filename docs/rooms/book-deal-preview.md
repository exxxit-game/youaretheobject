# First book deal: desktop slice

Type: fictional deal, not a psychological test or an empirical recreation.
The owner selected the book room and the trial ladder on 9 November 2026.
The source is the current owner conversation and the approved corridor foundation.
The final visual design and human experience are not yet accepted.

## Premise and actions

- In this fictional world this is the last copy of Stuart Chase's The Tyranny of Words.
  This is not a claim that the real book has only one copy or is lost in reality.
- Initial offer 100 fictional dollars; voluntary bargaining raises it to 250, 500,
  then 1000. Three raises; no further increase. These are trial prices, not the
  approved balance of all future episodes.
- One explicit button names the act and exact amount. Its click commits burning
  and that payment. No second confirmation screen is required for this probe.
- Refusal completes this deal with no payment and an intact book. No counteroffer
  follows refusal. Walking away, Escape, blur and interrupted input are not refusal.
- Leaving an unanswered deal preserves the reached quote. Re-entry and reload
  preserve the decision and payment. The episode ID remains intro-book even if
  reached through the repeated preview door on another logical floor.
- No timer, correctness score, real payment, data collection, or claim about a soul.

## State and persistence

The versioned record contains the episode's offer, open/burned/refused outcome
and paid amount. Balance is the sum of those entries, never an independent counter.
Terminal decisions cannot be reversed or paid again by repeated/late inputs.
The current prototype contains one episode; it is not a general story director.

Save on the meaningful action, not on unload. Web Locks serialises same-origin
writers; re-read inside the lock, validate the quoted offer, and write one record.
Recheck that the player remains inside before committing a queued callback.
Unavailable locks, denied storage, malformed data and unknown versions pause the
deal; never silently reset to zero. Do not delete or clear unrelated data.
Reload starts at the existing door anchor and restores the episode; it does not
restore the player's exact pose. No in-game new-attempt/reset control is added yet.
Clearing browser data or using another origin is not persistence across devices.

## Presentation and lifecycle adapter

The existing desktop preview owns the camera, walking, door and room shell.
Its adapter mounts one dynamic book group and HTML actions, shows them when
the room is entered, cancels pending input on leave/blur, and restores state on
return. It is not registered as the old protocol-based room 01. No duplicate rig,
consent, trial session, reporting, audio or legacy restart behavior is introduced.

The original cover is simple typography; no publisher image/logo or book text.
An intact book versus charred remains shows the result. This is a provisional
visual representation, not a fire simulation or a final burning animation.
The stand has matching movement bounds; an optional inspect action turns the
desktop view toward the book without moving the player. Controls use native click/Enter/Space;
there is no acceptance through movement, looking or a pointer-down event.

## Checks and limits

Pure checks cover finite quotes, refusal, stale/repeated/late input, corrupt and
blocked storage, one payment after another store/visit/floor, and stand collision.
Browser coverage must check the actual book group, UI balance, return and reload.
Desktop/trackpad observation, phone navigation and Quest are separate checks.
New browser code does not establish human moral change or binocular perception.

Technical sources read: MDN [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
and [Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API).
The local A-Frame 1.8.0 material documentation and existing canvas panels guide
rendering. The story premises come from the owner, not those API documents.
