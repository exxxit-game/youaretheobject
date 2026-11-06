export const T = {
  title: 'Точка зрения',
  intro: 'Рассмотри фигуру. Меняй её поворот, размер и ракурс в любом порядке.',
  actionsLabel: 'Управление фигурой',
  actions: {
    turn: 'Повернуть',
    scale: 'Размер',
    angle: 'Ракурс',
    return: 'Вернуть первый вид'
  },
  steps: {
    turn: 'Поворот',
    scale: 'Размер',
    angle: 'Ракурс',
    return: 'Возврат'
  },
  initial: 'Первый вид',
  returned: 'Первый вид восстановлен',
  history: count => `Действий: ${count}`
};
