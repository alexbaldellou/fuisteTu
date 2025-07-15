export const generarID = () => {
  return Math.random().toString(32).substring(2);
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const valorMasRepetido = (respuestas: any) => {
  const conteo: any = {};

  respuestas.forEach((r: any) => {
    const resp = r.respuesta;
    conteo[resp] = (conteo[resp] || 0) + 1;
  });

  // Buscar la respuesta con mayor conteo
  let maxRespuesta: string | null = null;
  let maxConteo: number = 0;

  for (const [respuesta, cantidad] of Object.entries(conteo) as [
    string,
    number
  ][]) {
    if (cantidad > maxConteo) {
      maxRespuesta = respuesta;
      maxConteo = cantidad;
    }
  }

  return { respuesta: maxRespuesta, conteo: maxConteo };
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
