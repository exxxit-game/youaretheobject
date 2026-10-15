// The subject's chair (in the paper the subject sat): under a seated player (the head is
// above the back half of the seat), pushed back behind a standing one, as if they had
// stood up from the table.
const CHAIR = { seated: ['0 0 0.43', '0 0 0'], away: ['0.1 0 0.95', '0 -8 0'] };

export function placeChair(underPlayer) {
  const [position, rotation] = underPlayer ? CHAIR.seated : CHAIR.away;
  const chair = document.querySelector('#chair');
  chair.setAttribute('position', position);
  chair.setAttribute('rotation', rotation);
}
