// tools/gdc-captions.mjs turns a talk's WebVTT captions into text: cue times dropped, a cue repeated across
// overlapping segments kept once, a mark at each new minute (a made-up sample in the WebVTT form, W3C WebVTT)
import assert from 'node:assert/strict';
import { vttToText } from '../tools/gdc-captions.mjs';

const vtt = [
  'WEBVTT', 'X-TIMESTAMP-MAP=MPEGTS:900000,LOCAL:00:00:00.000', '',
  '00:00:01.000 --> 00:00:03.000', 'Good afternoon,', 'everybody.', '',
  '00:00:04.000 --> 00:00:06.000', 'Welcome.', '',
  'WEBVTT', '',
  '00:00:04.000 --> 00:00:06.000', 'Welcome.', '',
  '00:01:02.000 --> 00:01:04.000', 'The second minute.', ''
].join('\n');
assert.equal(vttToText(vtt), '[00:00] Good afternoon, everybody. Welcome. \n[01:00] The second minute.');
assert.equal(vttToText('WEBVTT\n'), '', 'no cues give no text');
console.log('gdc captions tests: ok');
