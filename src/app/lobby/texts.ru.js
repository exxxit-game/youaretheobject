// Words the player sees and hears in the lab corridor before the first room.
// The player is always addressed formally ("вы").
export const LOBBY_T = {
  // the game's name stays in English in every language: the player is the object
  title: 'You are the object',
  // the light box over door 1: the name as the site's address, one lamp a word (src/app/lobby/sign.js)
  signWords: ['you', 'are', 'the', 'object', '.com'],
  // the head of the clipboard's form, as on a consent form: the participant's name goes on the
  // line (the game's name is on the light box over the door, not on the form)
  participant: 'Участник ____________________',
  // the promise first: what the player is offered
  welcome: [
    'Добро пожаловать в лабораторию.',
    'Здесь вы станете участником настоящих психологических опытов — тех, что когда-то проводили учёные.',
    'Вы узнаете, как поступаете именно вы, и сравните себя с участниками оригинала и с теми, кто был здесь до вас.'
  ],
  // the clipboard hangs on the experimenter's board left of door 1 (src/app/lobby/lobby.js)
  takeSheet: 'Возьмите планшетку: она висит на доске слева от двери.',
  chooseDoor: 'Выберите дверь. Сейчас открыта первая комната.',
  // under the door's line on the clipboard's hook page, read, not spoken (src/app/menu.js)
  menuHint: 'Меню и выход из комнаты — кнопка с тремя чёрточками на левом контроллере (на компьютере Esc).',
  // the computer player's line in the corridor (src/app/hint.js)
  hint: { title: 'You are the object.', body: 'Мышь: зажмите и тяните — оглядеться, щелчок — нажать. В шлеме: кнопка VR справа внизу.' },
  // the plaque on each stair's door, at the corridor's ends
  stairs: 'ЛЕСТНИЦА',
  // the building's directories (directory.js): the main one at the entrance in changeable capitals (a
  // heading, then each floor and what is on it); the floor's where one comes out of the elevator hall,
  // in capital and lower case as the 1979 report's panels (the floor, then the rooms and the stairs on
  // either hand)
  directory: {
    head: 'УКАЗАТЕЛЬ',
    sub: 'ЛАБОРАТОРИЯ',
    floor: (n) => `${n} ЭТАЖ`,
    floors: (a, b) => `${a}–${b} ЭТАЖИ`,
    rooms: (a, b) => `КОМНАТЫ ${a}–${b}`,
    closed: 'ЗАКРЫТО',
    panel: { floor: (n) => `${n} этаж`, rooms: (list) => `Комнаты ${list}`, stairs: 'Лестница' }
  },
  // the studio's poster on the board ends the participation (exit.js), in the lab's words:
  // the player is a participant here, not in a game
  exit: {
    ask: 'Прекратить участие?',
    leave: 'Прекратить',
    stay: 'Продолжить',
    done: 'Участие прекращено. Чтобы вернуться, обновите страницу.'
  },
  // the extinguisher's label (extinguisher-label.js), the words of a 1972 water extinguisher's label:
  // its agent, how to operate it ("hold upright, pull pin, squeeze lever"), what it is for
  extinguisher: {
    agent: 'ВОДА',
    name: 'ОГНЕТУШИТЕЛЬ',
    operate: 'КАК ПРИМЕНЯТЬ',
    steps: ['ДЕРЖАТЬ ВЕРТИКАЛЬНО,', 'ВЫДЕРНУТЬ ЧЕКУ,', 'НАЖАТЬ НА РЫЧАГ'],
    small: ['Для пожаров класса A: дерево,', 'бумага, ткань, мусор.', 'Не применять на электрооборудовании', 'под напряжением и на горючих', 'жидкостях.', 'Вместимость 9,5 л (2½ галлона).', 'После применения сразу', 'перезарядить.'],
    // the gauge's dial, its words as on the 1970 one (RECHARGE, RANGE, OVERCHARGED)
    gauge: { low: 'ЗАРЯДИТЬ', range: 'НОРМА', high: 'ПЕРЕЗАРЯЖЕН' }
  },
  // the flyer on the board (board.js): "подходите" is both "you qualify" and "you are coming closer"
  flyer: {
    title: 'ТРЕБУЮТСЯ\nИСПЫТУЕМЫЕ',
    body: 'Опыт не нужен.\nПодготовка не нужна.',
    punch: 'Вы подходите.',
    // the room's number comes from the plan
    tab: (n) => `Комната ${n}`
  }
};
