import quienEsMasProbable from "../assets/questions/quienesmasprobable.json";
import siJugador from "../assets/questions/sijugador.json";

export const generarID = () => {
  return Math.random().toString(32).substring(2);
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const valorMasRepetido = (respuestas: any) => {
  if (
    respuestas.length === 2 &&
    respuestas[0].respuesta !== respuestas[1].respuesta
  ) {
    return { respuesta: null, conteo: 0 };
  }

  const conteo: any = {};

  respuestas.forEach((r: any) => {
    const resp = r.respuesta;
    conteo[resp] = (conteo[resp] || 0) + 1;
  });

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
  const nameRand = players[Math.floor(Math.random() * players.length)];
  const name = nameRand ? nameRand.nombre : "";
  return name;
};

export const getPreguntas = () => {
  const questionsListWho = getQuestionsRandom(quienEsMasProbable.preguntas);
  const questionsListIf = getQuestionsRandom(siJugador.preguntas);
  const list = questionsListWho.concat(questionsListIf);
  return list;
};
