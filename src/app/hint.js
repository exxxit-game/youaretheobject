// The short line in the bottom-left corner of the page, for a player at a computer (a headset
// never shows it): how to look around and press, here and now. It goes once the player has done
// what it says (the first press or key) or entered VR, so it never stays over the view; a player
// already in VR (a headset sends no press or key to the page) never gets it.
// showHint({ title, body })
export function showHint({ title, body }) {
  const hint = document.getElementById('hint');
  const scene = document.querySelector('a-scene');
  if (scene?.is('vr-mode')) return;
  const b = document.createElement('b');
  const span = document.createElement('span');
  b.textContent = title;
  span.textContent = body;
  hint.replaceChildren(b, ' ', span);
  hint.classList.add('show');
  const off = () => {
    hint.classList.remove('show');
    window.removeEventListener('pointerdown', off);
    window.removeEventListener('keydown', off);
    scene?.removeEventListener('enter-vr', off);
  };
  window.addEventListener('pointerdown', off);
  window.addEventListener('keydown', off);
  scene?.addEventListener('enter-vr', off);
}
