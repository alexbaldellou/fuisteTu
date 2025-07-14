export const generarID = () => {
  return Math.random().toString(32).substring(2);
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const valorMasRepetido = (array: any) => {
  var frecuencias: any = {};

  const repetido = array.reduce(function (
    valorMasRepetido: any,
    elemento: any
  ) {
    frecuencias[elemento] = (frecuencias[elemento] || 0) + 1;
    return frecuencias[elemento] > frecuencias[valorMasRepetido]
      ? elemento
      : valorMasRepetido;
  },
  array[0]);

  // Verificar si algún elemento se repitió
  const repeticiones = Object.values(frecuencias);
  const hayRepetidos = repeticiones.some((count: any) => count > 1);

  if (hayRepetidos) {
    return repetido;
  }

  return undefined;
};

export const ordenarMayorMenor = (list: any[], nameOrder: string) => {
  return list.sort((a, b) => {
    return b[nameOrder] - a[nameOrder];
  });
};

export const getQuestionsRandom = (questions: any) => {
  const barajadas = [...questions].sort(() => 0.5 - Math.random());
  return barajadas.slice(0, 30);
};

export const getNameRandom = (players: any[]) => {
  return players[Math.floor(Math.random() * players.length)];
};
