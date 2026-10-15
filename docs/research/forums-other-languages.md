# WebXR / A-Frame / Quest Browser practice in non-English sources (sweep of 2026-10-11)

> Kept as the research agent wrote it on 11.10.2026 for the revision (objekt-files/notes/archive/docs/audit/revision.md, shelf 5): Japanese, Chinese, Korean, Russian, Ukrainian, German, French, Spanish and Portuguese sources.
> Each point still has to be checked against our code and A-Frame 1.8.0 before anything changes; the first pass of that is on the revision page.


Scope: what practitioners wrote in Japanese, Chinese, Korean, Russian/Ukrainian, German, French, Spanish, Portuguese.
Topics: (1) frame rate on Quest Browser; (2) A-Frame 1.6-1.8 and Quest Browser bugs; (3) debugging on the headset;
(4) hands, controllers, grabbing; (5) shipping a WebXR PWA to the Meta Horizon Store.
Weight per point: shipped product / A-Frame or three.js contributor / Meta employee / speaker / anonymous. Pre-2023 = possibly stale.
Agreement: (a) several independent people, (b) one person, (c) contradicted.

## Parts (each gets an answer or "not found")
- JA: Qiita, Zenn, note, Speaker Deck / connpass, WebXR Tokyo/Japan community
- ZH: Juejin, Zhihu, CSDN, cnblogs, Bilibili
- KO: velog, tistory, naver
- RU/UK: Habr, vc.ru, dev.to ru
- DE/FR/ES/PT: heise, dev blogs, dev.to, Medium

## Findings (appended as found)

### JA-1. binzume (Kousuke Kawahira), "Meta Quest ブラウザのWebXRの対応状況(2022年11月)", Qiita, 2022-11-06 (STALE, pre-2023)
https://qiita.com/binzume/items/5ae3375ee3334e38de5f
Experience: author of a shipped WebRTC+WebXR VR remote desktop (https://qiita.com/binzume/items/52a4f4be5c316753e1b1). Topic (2): browser feature gaps.
- Quest Pro, Browser 24.2 (Chromium 106). Release notes not updated for long; track forums/social/Chromium instead.
- Persistent anchors: per-origin limit, no listing; at the limit the only fix is clearing site data, which ALSO clears cookies and localStorage. (relevance to us: localStorage = player's profile; any API that forces "clear site data" wipes it.) (b) one person, stale.
- hit-test blocked by permissions policy at that time. Not relevant to us.

### JA-2. wakufactory, "WebVR環境としての OculusQuest (2021)", Qiita, 2021-12-05 (STALE)
https://qiita.com/wakufactory/items/b0fdf55da157e7a3346a
Experience: long series of Quest WebXR experiments on Qiita (mesh detection, plane detection, system keyboard), A-Frame components; WebXR Advent Calendar author.
- Text/images mapped as textures on 3D surfaces pass several transforms and lose quality; WebXR Layers display directly and "明らかに画質が向上していることがわかります" (image quality clearly improves) in A-Frame samples. Topic (1) text. (a) agrees with Meta's own layers advice (English).
- Controller beam in 2D browsing fires both mouse and touch events: "コントローラのビームによる操作は、マウスとタッチの両方のイベントを発生する". Topic (4): double handlers in 2D UI. (b).

### JA-3. sawa-zen, "WebXRの今とこれから", note, 2025-08-21
https://note.com/sawa_zen/n/n4692cb9c68f1
Experience: runs the WebXR JP community (self-described; Design Engineer); no shipped product named in the article.
- Post effects drop FPS at once: "特にポストエフェクトを使用すると途端にFPSが落ちる印象があり" ("impression"). No XR device has WebGPU, WebGL only. Topic (1). (a) general consensus, (b) as phrased.
- WebXR as an entry point; installation of a native app prompted from the web experience. PWA/store not discussed.

### JA-4. koduki, "Meta QuestでA-Frameのデバック環境を整える" (Zenn scrap), 2022-11-08 (STALE)
https://zenn.dev/koduki/scraps/27e97a11697ab2
Experience: anonymous-ish one-off scrap (individual developer). Topic (3).
- Quest needs HTTPS for WebXR from a LAN server, so VS Code Live Server is slower than running a server with a certificate: "HTTPSにして接続する必要があるのでvscodeのLive Sever等を使うより直接起動させた方が早い". Windows Defender must let the server through ("Windows DefenderにACLを通すのを忘れない事"). Remote debug through chrome://inspect/#devices. (a) agrees with npaka note https://note.com/npaka/n/nc269a3c28b0c (HTTPS needed, ADB driver on Windows). 
- Note: localhost via `adb reverse` is a secure context and avoids the certificate (not stated in these posts; from English docs, unverified here).

### JA-5. ikkou (HEAVEN chan), "#WebXR ( WebVR/WebAR ) の現状確認 2024 Winter", Zenn, 2024-12-25 (upd. 2025-01-04)
https://zenn.dev/ikkou/articles/f772b7afe34fdd
Experience: writes the yearly Japanese WebXR status review (2022, 2023, 2024 Winter); community figure, not a shipped-product author as far as stated.
- Topic (3): as of 2024-12-25 no browser on a Windows PC with Quest 3 (Link) ran immersive-vr/immersive-ar: "Windows PC × Meta Quest 3 の組み合わせで `immersive-vr` または `immersive-ar` が動作するブラウザはありませんでした" (author allows it may be his own setup). => do not plan PC+Link as the test bench; test on the headset or with an emulator. (b) one person.
- Topic (5): the 2023 article ended "PWA な WebXR コンテンツを作って各ストアに出しましょう" (Meta and PICO were pushing PWA); 2024: the push is not gone but attention moved to Vision Pro.
- Browser facts: v31.1 depth sensing; v34.2 unbounded spaces (flag); v35.1 MX Ink stylus; A-Frame has `logitech-mx-ink-controls`.

### JA-6. drumath2237 (にー兄さん), "あなたの知らないWebXR Device APIの話を軽率に", Speaker Deck, XR Kaigi 2024, 2024-12-19
https://speakerdeck.com/drumath2237/about-webxr-device-api-you-dont-know
Experience: conference speaker (XR Kaigi 2024, Japan's main XR conference), with code samples. Topic (3).
- IWER (Meta's Immersive Web Emulator Runtime) can be installed in the app itself (`npm i iwer` or CDN), `XRDevice` with preset `metaQuest3`, then `installRuntime()`; "IWERのAPIは3Dライブラリ非依存" (library-independent). Action Recording & Playback (beta) records XRSession/XRFrame data and replays it -> a recorded headset session can be replayed in CI. (b) one speaker; IWER itself is Meta's (primary source in English).
- Quest Browser: several modules behind an incubation flag (mesh detection static, body tracking from head+hands on Quest 3).

### JA-7. Hayashi (HoloLab Inc., Japanese XR company), "Meta の WebXR開発環境「Immersive Web SDK」と Claude Code/Codex でXRプロトタイピング", Zenn, 2026-04-24 (upd. 2026-05-12)
https://zenn.dev/hololab/articles/361196a3adb655
Experience: engineer at an XR company; first try only, headset not yet connected.
- IWSDK = three.js + ECS + Vite (a build step); `npm run dev` launches a headless browser. Problem hit: Japanese text in its UI panels came out as tofu boxes because the font did not load; set aside after ~15 min. Relevance: non-Latin text on panels needs its font explicitly loaded (we draw Russian on canvas). (b) one person.

### JA-8. Store / PWA (Japanese)
- TAM Design Tech note (2021, STALE) on PWA to Oculus Store: https://note.com/tamdesigntech/n/n6fe0cde04692 (not opened; process from 2021 is outdated).
- ikkou 2023 Winter: Meta and PICO pushing PWA; Japanese notable PWA example only U-NEXT (2021) (from search snippet, not opened -> unverified).

## ZH (Chinese): Juejin, Zhihu, CSDN, cnblogs, SegmentFault, Bilibili
Four searches (2 domain-limited, 1 extended, 1 Zhihu/Juejin/SegmentFault). Result: no practitioner writing about A-Frame or three.js WebXR on Quest Browser found.
What exists: A-Frame intro tutorials (Zhihu 2017-2022, e.g. https://zhuanlan.zhihu.com/p/471360202, STALE), CSDN rehash posts of generic WebXR tips (e.g. https://blog.csdn.net/chenjj4003/article/details/143665003, auto-generated style, ranks last), native Unity/UE Quest posts.
Likely reason (my inference, unverified): Quest is not sold officially in mainland China; local WebXR work targets PICO.
- One useful line from a GitHub issue in Chinese (project DreamPortalOS/vr180-ai-pipeline #434, not a blog): USB + `adb reverse` then open localhost in Quest Browser; localhost is a secure context so WebXR works without a certificate. https://github.com/DreamPortalOS/vr180-ai-pipeline/issues/434 (from search summary; NOT opened -> unverified). Topic (3).
Verdict: ZH = not found (no useful practitioner content).

## KO (Korean): velog, tistory, brunch (naver blog: search tool refuses blog.naver.com - "domains are not accessible to our user agent")
Three searches. Only one practitioner post found:
### KO-1. 허형준 (hhj_), "WebXR로 웹 VR 게임 만들기", velog, 2023-10-31
https://velog.io/@dipokalhhj/WebXR-VR
Experience: shipped a small three.js WebXR lightsaber game (saber.devent.kr, source on GitHub); one developer; Quest 2/3 named generally.
- Topic (1): "조금만 라이팅이 들어가도 끊긴다. 오브젝트가 많아도 끊긴다." (a little lighting already stutters; many objects stutter). Kept models under ~5,000 polygons; files over ~1 MB began to slow it. (b) one person.
- Collision checks (three.js OBB) capped at about 15 per scene: "한 Scene에 들어가는 충돌 처리의 수는 15개 내외로 제한했다"; performance fell sharply past ~200. Skip checks for objects already hit or far away. (b).
- Removed objects: dispose geometry and remove from scene, otherwise rendering stays slow. (a) agrees with Brown VR wiki (English) and three.js docs.
- Little troubleshooting material in Korean; relied on three.js GitHub issues.
Verdict: KO = one useful post; the rest not found.

## RU/UK (Russian/Ukrainian): Habr, vc.ru, dev.to, tproger, dou.ua
Four searches. No practitioner post on WebXR performance, bugs or debugging on Quest Browser found.
- Domclick (Sber group), Egor Molchanov, "VR tour on A-Frame + React" (title in Russian), Habr, 2024-02-08: https://habr.com/ru/companies/domclick/articles/791790/ (opened). Shipped a 360 tour; desktop/mobile only, no headset; no performance or bug content. Only practical bits: preload in <a-assets> with a timeout; A-Frame's default light replaced by ambient light (he did not want the shadows); position objects with the inspector (Ctrl+Alt+I). Not useful beyond basics.
- Other Habr items are A-Frame overviews (2017-2020, STALE) or headset reviews. Habr MTS review of Quest 3 (https://habr.com/ru/companies/ru_mts/articles/1034652/, not opened) says browser text looks slightly blurred off the lens centre (search snippet only -> unverified).
Verdict: RU/UK = not found.

## DE / FR / ES / PT
Searches: DE (general + heise/entwickler/golem/mixed/t3n), FR (general), ES (general + medium/dev.to). The engines return English forum threads (Babylon.js forum, Meta community forum) for German/French queries; those belong to the English sweep.
- DE: heise iX 2021 "Überraschend einfach: Immersive Web mit AFrame" https://www.heise.de/select/ix/2021/10/2121013414094383504 (heise select, paid, STALE 2021; not opened). entwickler.de "Das immersive Web im Browser" (intro). mixed.de = news only (Web Launch, Wonderland Engine port of "Dead Secret Circle"). No German practitioner post on Quest Browser performance or bugs found.
- FR: nothing in French found.
- ES: only a Spanish Medium intro ("WEBXR. Porque nosotros construimos nuestros mundos...") with no Quest specifics.
- PT: (see below)
- PT: one search (medium, dev.to, tabnews, imasters, alura): only generic intros; nothing from a practitioner. PT = not found.
Verdict: DE/FR/ES/PT = not found (no native-language practitioner writing on Quest Browser WebXR); the active writers in these countries publish in English (other agent's sweep).

### JA-9. Text in A-Frame/three.js (topic 1, text rendering)
- teatwo, "A-Frameで日本語フォントを使う", Zenn, 2024-07-31 (re-post of 2020-04-13, STALE content): https://zenn.dev/teatwo/articles/86c76739e8fc8e
  A-Frame ships no Japanese font ("現在、A-Frameには標準で日本語フォントがありません。"); MSDF atlases for full kana+joyo kanji came out ~6.9-9.3 MB PNG each, JSON ~430-530 kB; some glyphs missing from Noto/ふい字 TTF; online generator fails for the full kanji set, CLI msdf-bmfont-xml used. Individual; (b).
  Relevance to us: for a large glyph set MSDF atlases are heavy; Cyrillic is small, so either way works; canvas panels avoid atlas generation entirely.
- フクサキマイ (mai_depart), "Three.jsでテキストを表示する方法を調べる", note, 2024-09-02: https://note.com/mai_depart/n/n321b4de4443a
  Seven methods from the three.js manual; qualitative only; no VR testing. Not useful beyond the manual.

### Author weighting check (GitHub contributors API, 2026-10-11; `gh api repos/aframevr/aframe/contributors` 407 logins, `repos/mrdoob/three.js/contributors` 363 logins returned, the API caps the list)
- binzume: A-Frame contributor = YES. three.js: not in returned list.
- yomotsu (Japanese, author of camera-controls): three.js contributor = YES.
- takahirox (Takahiro Aoyagi, Japanese): A-Frame and three.js contributor = YES.
- wakufactory, ikkou, drumath2237, Tks_Yoshinaga, sawa-zen: not in either list.

### JA-10. binzume, "A-FrameでCSS Flexboxライクなレイアウトで日本語対応なUIを作った", Qiita, 2019-10-14 (STALE)
https://qiita.com/binzume/items/6bd95acd18609b934810
Experience: A-Frame contributor; shipped aframe-xylayout (https://github.com/binzume/aframe-xylayout) and aframe-vrm. Topic (1) text, (4) input.
- Text: falls back to Canvas rendering for multibyte characters, result "あまりきれいじゃない" (not very pretty); resolution configurable; for quality use an MSDF font holding the needed glyphs. (b) one person, stale; contrast: wakufactory JA-2 says layers are sharper than any texture.
- Soft keyboard sends KeyboardEvents to the focused DOM element, so a Bluetooth keyboard on Quest works too.
- Other A-Frame UI libraries compared: Material Kit (no layout, abandoned), aframe-gui (closest), AFRAME Material Collection (Yoga layout, draws to a RenderTexture so the UI is flat).

### JA-11. Grabbing (topic 4)
- Takashi Yoshinaga (@Tks_Yoshinaga, Japanese XR evangelist and workshop speaker), "A-FrameとOculus Questでオブジェクトを掴んだりテレポーテーションしたり", Qiita, 2019-07-04 (STALE, A-Frame 0.9.2): https://qiita.com/Tks_Yoshinaga/items/bd7f85a2eada4f6a9113
  Grab = gripdown/gripup flag + raycaster-intersection; in tick() the object is moved to a point 1.2 m along the ray (no reparenting); he notes taking the first hit "本当はもうちょっと上手にやるべき" (should really be done better). Teleport via aframe-teleport-controls on X button. Beginner pattern; A-Frame 1.5+ ships its own grab for hands (hand-tracking-grab-controls) — no Japanese post on it found.
- のらねこび, "【初心者向け】WebXRの始め方 ― Quest 3で自作VR体験を動かすまで", note, 2026-02-15: https://note.com/buncho3/n/n737643921d1b
  three.js + Vite + vite-plugin-mkcert; pitfalls: HTTPS required ("HTTPS接続でないと動作しません"), `server.host: true` or Quest cannot reach the dev server, accept the certificate warning in Quest Browser (詳細設定 -> 続行する), firewall on port 5173. Beginner; (a) the HTTPS point agrees with JA-4 and KO-1.

### JA-12. WebXR Advent Calendar 2025 (the Japanese WebXR community's yearly collection), list: https://adventar.org/calendars/12324 (25 entries; none about A-Frame)
- sawa-zen, "WebXRセッション中にVideoElementが更新されない問題と解決策", note, 2025-12-23: https://note.com/sawa_zen/n/nc055e9ebedea
  Experience: runs WebXR JP; ships XRift (browser metaverse in beta, three.js + R3F, https://xrift.net/ ; https://note.com/sawa_zen/n/nb4e44355d3d6, 2025-12-25).
  Topic (2) bug: a <video> element created DURING a WebXR session shows one frame then freezes on Quest 2, Quest 3, Quest Pro and Pico 4 (fine on desktop); opening the system menu sometimes revives it. Fix ("placeholder pattern"): "XRセッション開始前にVideoElementを作成してDOMに追加しておく" (create the video element and add it to the DOM before the session starts), then only swap `srcObject`; on end set it to null and keep the element. Cause given as suspected, not confirmed; no browser version named. (b) one person (he links a three.js forum thread and a GitHub issue, not opened -> unverified that others report it).
- tatta_chotdog, "1年間WebXRに触れてみて", Zenn, 2025-12-12: https://zenn.dev/tatta_chotdog/articles/da95fffc555985 — samples in plain JS with no build step; recommends troika-three-text for text and IWE/IWER for debugging; open problems: monetisation of a standalone web app, users find headset->browser->session start a hassle. Low weight (one year's hobby experience).

### JA-13. ikkou on immersive navigation and stores (topic 5 and 2)
- "Meta Quest Browserにnavigationが“標準実装”されたので…", Zenn, 2022-12-06 (STALE): https://zenn.dev/ikkou/articles/fe5b177a53c078
  Quest Browser 24.4 (2022-12-03) made in-VR page navigation default, same origin only: "現時点で標準実装されているのは 同一オリジン (Same-Origin) に限られます。" Cross-origin needed the `WebXR navigation permission` flag. Updates reach devices days late (his Quest Pro a week after release). Relevance: A-Frame's link component works between our own pages (same origin on GitHub Pages).
- "#WebXR ( WebVR/WebAR ) の現状確認 2023 Winter", Zenn, 2023-12-01: https://zenn.dev/ikkou/articles/5d0b9bb6571485
  WebXR PWAs can go to the Meta Store (strict review) or App Lab (lower bar); PICO announced official immersive PWA support on 2023-10-30: "PICO プラットフォームでも WebXR な PWA を PICO ストアに掲載できるようになりました。" -> a second store for the same PWA. (b) one person reporting vendor announcements; App Lab has since been merged into the Horizon Store (English sources; not checked here -> unverified in this sweep).
- Japanese "shipped to the Horizon Store, review/rejection" reports: NOT FOUND (one search ja + one general).
- A-Frame 1.6/1.7/1.8 in Japanese or Chinese: NOT FOUND (two searches).

### Cross-check of JA-12 (sawa-zen video bug) against English threads (one search, one thread opened)
- Same symptom reported for video textures on several headsets: three.js forum "Video texture no longer updating after entering WebXR mode" https://discourse.threejs.org/t/video-texture-no-longer-updating-after-entering-webxr-mode/43068 (not opened; search summary says one poster saw it fixed by a Pico browser update -> browser-version dependent). So: (a) several independent people report frozen video in XR; the "create before session" fix is (b) sawa-zen only.
- Related, for our canvas panels: three.js forum "Animated <canvas> > canvasTexture > dont work in WebXr, why?" 2025-04-24, Quest 2: https://discourse.threejs.org/t/animated-canvas-canvastexture-dont-work-in-webxr-why/81587 (opened). The canvas froze at its last pre-session frame; cause in the poster's own code: "a part of my previous function was relyng with… requestanimationFrame" (window rAF does not drive frames inside the immersive session). Reply by manthrax: in XR "the animationLoop function gets called twice" per frame (once per eye) -> redraw the canvas once per frame, not per eye. (b) forum, anonymous-level weight; English (other agent's sweep).
- Weight note: manthrax IS a three.js contributor (contributors list); PavelBoytchev not in the list. CAUTION (c): the claim that the animation loop runs twice per frame (once per eye) is at odds with three.js's setAnimationLoop, which is called once per XRFrame (per-eye work happens inside renderer.render, e.g. onBeforeRender per sub-camera). Not verified here -> unverified; do not act on it without reading three.js WebXRManager.

### JA-14. oggata (Fumitoshi Ogata), "MetaQuest2 + A-Frame / BabylonJsを使ったhandtracking", Qiita, 2022-06-27 (STALE, A-Frame 1.2/1.3)
https://qiita.com/oggata/items/33803cb07f67e39ddb59
- hand-tracking-controls with `pinchmoved`; physics did not work in A-Frame 1.2.0/1.3.0 (three.js Geometry removed); a deprecated-Geometry polyfill fixed physics and distorted hand meshes; leaned to Babylon.js because A-Frame physics add-ons lagged hand-tracking updates. (b) one person, stale. Lesson that may still hold: community add-ons (physics) lag A-Frame/three.js releases; pin versions.

### Measuring on the headset in Japanese (topic 3)
Search for OVR Metrics / GPU on WebXR pages in Japanese: only native Unity posts (e.g. https://qiita.com/LightnGames/items/f9e0e993729fe8884a74). WebXR-specific measuring: NOT FOUND.

## SUMMARY OF THE SWEEP (2026-10-11)
Searches used: 50 of 60. Pages opened: 37 of 80.
- JA: rich (community WebXR JP, yearly status reviews by ikkou, Advent Calendars, XR Kaigi talk). Mostly features/setup; little on frame-rate tuning.
- ZH: not found (generic CSDN rehashes; Zhihu blocked by login wall).
- KO: one shipped-game post (velog); naver blog refused by the search tool.
- RU/UK: not found (Habr: A-Frame overviews, one Domclick 360 tour without headset).
- DE/FR/ES/PT: not found in native language; engines return English threads.
Topic coverage in non-English sources:
(1) frame rate: post effects and lighting are the first FPS killers (JA, KO); layers sharper than textures for text (JA); multiview, foveation, refresh rate, GC, texture compression: NOT FOUND beyond generic lines.
(2) bugs: video element created in-session freezes (JA 2025); persistent-anchor limit forces clearing site data incl. localStorage (JA 2022, stale); A-Frame 1.6-1.8: NOT FOUND.
(3) debugging: HTTPS/adb reverse for LAN testing (several); no PC browser ran immersive-vr with Quest 3 over Link at 2024-12-25 (JA); IWER recording/playback (JA talk).
(4) hands/controllers: beam fires mouse+touch in 2D (JA 2021); old grab patterns (2019); physics add-ons broke with A-Frame 1.2/1.3 (2022). A-Frame's own hand grab: NOT FOUND in these languages.
(5) store: PWA to Meta Store/App Lab and PICO Store (JA 2023); no first-hand review/rejection report in any of these languages: NOT FOUND.
Unverified: the adb-reverse GitHub issue (not opened); the Habr MTS note on blurred text off lens centre (snippet); the "loop runs twice per eye" claim; App Lab merge (not checked here).
Blocked: zhihu.com article (403 / login wall in the browser pane): https://zhuanlan.zhihu.com/p/622957093 ; blog.naver.com refused by the search tool; heise select article is paid: https://www.heise.de/select/ix/2021/10/2121013414094383504 (2021, stale).
