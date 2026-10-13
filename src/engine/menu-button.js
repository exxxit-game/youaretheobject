// The game's menu button: on Quest, the left controller's Menu button (≡), the one Meta gives an app for
// its own menu ("This button is designed to open and close the menu of the active application",
// developers.meta.com/horizon/design/controllers/; VRC.Quest.Input.1: "In-app menus should be activated
// with the menu button"); the right one, the Meta button, is the system's and never reaches the page.
// A-Frame's meta-touch-controls names no menu button, so it is read from the WebXR gamepad itself: the
// WebXR Input Profiles registry (meta-quest-touch-plus, the left layout) puts "menu" at button 7. B or Y
// (button 5, "Back out, cancel" in Meta's default mapping) is passed on as the way back. On a computer the
// Escape key opens and closes the menu, as in desktop games. Emits on the scene 'menu-button' and
// 'menu-back'; docs/research/vr/menu-button.md holds the sources.
const MENU = 7, BACK = 5;

AFRAME.registerComponent('menu-button', {
  init() {
    this.held = new Map();   // "hand:button" -> pressed in the last frame, so one press is one event
    this.onKey = (e) => { if (e.code === 'Escape' && !e.repeat) this.el.emit('menu-button', { source: 'key' }); };
    window.addEventListener('keydown', this.onKey);
  },
  remove() { window.removeEventListener('keydown', this.onKey); },
  tick() {
    const session = this.el.xrSession;
    if (!session) return;
    for (const source of session.inputSources) {
      const pad = source.gamepad;
      if (!pad) continue;
      if (source.handedness === 'left') this.edge('left:menu', pad.buttons[MENU], 'menu-button', source.handedness);
      this.edge(`${source.handedness}:back`, pad.buttons[BACK], 'menu-back', source.handedness);
    }
  },
  // a press is its first frame down: the event fires once, however long the button is held
  edge(key, button, name, hand) {
    const down = !!(button && button.pressed);
    if (down && !this.held.get(key)) this.el.emit(name, { source: hand });
    this.held.set(key, down);
  }
});
