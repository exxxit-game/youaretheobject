export const T = {
  title: 'Точка зрения',
  intro: 'Выбери 180° напрямую. Потом начни заново и выбери 90°, затем 180°. Сравни вид и память.',
  xrIntro: 'Сравни 180° напрямую и после 90°. Между пробами начни заново.',
  actionsLabel: 'Управление фигурой',
  actions: {
    start: '0°',
    front: '90°',
    end: '180°',
    scale: 'Размер',
    angle: 'Ракурс',
    restart: 'Начать заново'
  },
  view: angle => `Вид: ${angle}°`,
  memory: frontSeen => frontSeen ? 'Память: 1 (открывали 90°)' : 'Память: 0',
  history: count => `Действий: ${count}`
};
