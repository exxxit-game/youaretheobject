// Words the player sees in every room: consent and shared buttons.
// The player is always addressed formally ("вы").
export const APP_T = {
  // the lab's name, round its seal (src/app/seal.js)
  lab: 'Лаборатория экспериментальной психологии',
  // one screen after another: a screen holds one thought, the last one the choice
  consent: {
    // the first two pages are a short consent form, as such forms read: who agrees to what, what
    // they know; then the date, a line to sign and the place for the lab's seal
    form: {
      title: 'Согласие на участие',
      agree: 'Я, ______________________, соглашаюсь принять участие в психологическом исследовании.',
      known: 'Мне известно, что часть деталей раскроют только в конце и что прекратить участие можно в любой момент: снять шлем или закрыть страницу.',
      date: 'Дата:',
      sign: 'Подпись ______________________',
      mark: 'М.П.',
      // shown where the button will be until the name, then the signature, is written
      nameNote: 'Впишите имя: зажмите курок или кнопку мыши и ведите по строке.',
      signNote: 'Распишитесь: зажмите курок или кнопку мыши и ведите по строке.'
    },
    locale: 'ru-RU',
    pages: [
      [
        'Если вы начнёте с записью, анонимный итог — ваши ответы и действия, без имени и адреса — попадёт в общую статистику. Без записи ничего не сохраняется.',
        'Подробно о данных: youaretheobject.com/privacy'
      ]
    ],
    withRecording: 'Начать с записью',
    withoutRecording: 'Начать без записи',
    // recording is for adults: asked before the choice
    age: { ask: 'Вам уже исполнилось 18 лет?', yes: 'Да', no: 'Нет' },
    minor: 'Тогда начнём без записи: вы пройдёте всё так же, только ничего не сохранится.',
    start: 'Начать'
  },
  // Playtest mode only (?playtest=1).
  playtest: {
    consent: 'Это проверка игры. В конце будет пять коротких вопросов. Если вы начнёте с записью, ответы и время прохождения уйдут разработчикам без имени.',
    intro: 'Спасибо! Пять коротких вопросов для разработчиков.',
    next: { ask: 'Насколько хочется пройти следующую комнату?', labels: ['Совсем не хочется', '', 'Очень хочется'] },
    boring: { ask: 'Когда было скучнее всего?', answers: ['Инструкция', 'Сами попытки', 'Вопросы', 'Разбор', 'Нигде'] },
    guessed: { ask: 'Вы догадались, в чём фокус, до разбора?', answers: ['Да', 'Частично', 'Нет'] },
    trouble: { ask: 'Было ли что-то неудобно?', answers: ['Нет', 'Трудно читать', 'Кнопки', 'Голос', 'Укачало'] },
    psych: { ask: 'Знакомы ли вы с психологией?', answers: ['Нет', 'Немного', 'Учился(ась)'] },
    thanks: 'Спасибо, это очень поможет.'
  },
  // A player who left before the end (src/app/left-early.js).
  leftEarly: {
    now: 'Вы вышли до конца опыта.',
    before: 'В прошлый раз вы вышли до конца опыта.',
    back: 'Вернуться в опыт',
    learn: 'Узнать, что это было',
    again: 'Пройти заново'
  },
  // The game's menu (src/app/menu.js): the Menu button on the left controller, Escape on a computer.
  menu: {
    title: 'Меню',
    resume: 'Продолжить',
    leaveRoom: 'Выйти из опыта',
    leaveRoomAsk: 'Выйти из опыта до разбора? Этот проход не сохранится.',
    leaveRoomYes: 'Выйти',
    // after the debrief the run is kept: the way out is only back to the corridor
    toCorridor: 'Выйти в коридор',
    toCorridorAsk: 'Выйти в коридор? Что ещё осталось в комнате, не покажется.',
    stay: 'Остаться',
    leaveGame: 'Прекратить участие'
  },
  understood: 'Понятно',
  repeat: 'Повторить',
  next: 'Дальше',
  done: 'Готово',
  again: 'Пройти ещё раз',
  share: 'Не рассказывайте друзьям, в чём фокус. Пусть пройдут сами.',
  link: 'youaretheobject.com'
};

export const plural = (n, one, few, many) => {
  const m = n % 100, d = n % 10;
  return (m > 10 && m < 20) ? many : d === 1 ? one : (d > 1 && d < 5) ? few : many;
};
