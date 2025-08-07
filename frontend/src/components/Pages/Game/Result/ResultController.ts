import { useEffect, useRef, useState } from "react";
import { valorMasRepetido } from "../../../Utils";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../../../utils/socket";
import { useSelector } from "react-redux";

const ResultController = () => {
  const navigate = useNavigate();
  const { partida } = useParams();
  const [playerResp, setPlayerResp] = useState<any>();
  const [win, setWin] = useState<boolean>(false);
  const [nextQuestion, setNextQuestion] = useState<boolean>(false);
  const [resultList, setResultList] = useState<any>([]);
  const [numberQuestion, setNumberQuestion] = useState<number>(0);
  const [playersResp, setPlayersResp] = useState<any>([]);
  const hasExecuted = useRef(false);
  const idPlayer = useSelector((state: any) => state.user);
  const preguntasList = useSelector((state: any) => state.questionsList.list);
  const typePlayer = useSelector((state: any) => state.user.tipo);

  useEffect(() => {
    if (win) {
      hasExecuted.current = true;
    }
  }, [win]);

  useEffect(() => {
    socket.emit("resultQ", { partida });

    const getResultQ = ({ result, count }: { result: any; count: number }) => {
      console.log("DEBUG: Evento allPlayersAnswered recibido", {
        result,
        count,
      });
      setNumberQuestion(count);
      setResultList(result);
    };
    socket.on("getResultQ", getResultQ);

    return () => {
      socket.off("getResultQ", getResultQ);
    };
  }, [partida]);

  useEffect(() => {
    if (resultList.length > 0) {
      const allResponse = resultList.map((player: any) => {
        const responsePlayer = {
          ...player.respuestas,
          jugador: player.nombre,
          url: player.url,
        };
        return responsePlayer;
      });
      setPlayersResp(allResponse);

      if (numberQuestion > 0) {
        theWinnerIs(allResponse);
      } else {
        console.log("finish");
        setTimeout(() => {
          navigate(`/final/${partida}`);
        }, 10000);
      }
    }
  }, [resultList, numberQuestion]);

  useEffect(() => {
    if (preguntasList.length > 0 && typePlayer === "host") {
      socket.emit("questionsList", { partida, list: preguntasList });
    }
  }, [preguntasList]);

  useEffect(() => {
    if (nextQuestion) {
      setTimeout(() => {
        navigate(`/sala/${partida}`);
      }, 10000);
    }
  }, [nextQuestion]);

  const theWinnerIs = (result: any) => {
    const mostRepeatedName = valorMasRepetido(result);
    const respPlayer = result.find(
      (player: any) => player.jugador === idPlayer.nombre
    );
    if (mostRepeatedName.conteo > 0) {
      if (
        respPlayer.respuesta === mostRepeatedName.respuesta &&
        !hasExecuted.current
      ) {
        //mandar 100 puntos
        socket.emit("playerWinner", { partida });
        setWin(true);
      }

      console.log("next");
      updateNPreguntas();
      setNextQuestion(true);
      setPlayerResp(mostRepeatedName.respuesta);
    } else {
      setNextQuestion(true);
    }
  };

  const updateNPreguntas = () => {
    const updateNPreguntas = numberQuestion - 1;

    socket.emit("setNumberQuestion", {
      id: partida,
      nPreguntas: updateNPreguntas,
    });
  };

  return {
    playerResp,
    playersResp,
    win,
  } as const;
};

export default ResultController;
