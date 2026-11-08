export const T = {
  title: 'Точка зрения · подъезд',
  loading: 'Открываем лестничный пролёт…',
  instruction: 'Поднимитесь на один этаж. Можно продолжать вверх и вниз. Стрелки вверх/вниз — идти, влево/вправо — повернуться, A/D — шаг вбок, R/F — взгляд вверх и вниз. Обзор также работает тачпадом.',
  unavailable: 'Не удалось открыть трёхмерную сцену. Попробуйте обновить страницу.',
  eyeLabel: 'Высота глаз',
  eyeValue: height => `${height.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} м`,
  views: {
    start: 'А · У двери',
    turn: 'Б · Поворот',
    overlap: 'В · Перила',
    top: 'Г · Этаж выше',
    below: 'Д · Этаж ниже'
  }
};
