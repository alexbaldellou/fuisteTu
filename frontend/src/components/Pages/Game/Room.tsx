import { useEffect, useState } from "react";
import Questions from "./Questions/Questions";
import CountDown from "./CountDown/CountDown";
import { useParams, useNavigate } from "react-router-dom";
import { getNameRandom, getQuestionsRandom, getRandomInt } from "../../Utils";

import quienEsMasProbable from "../../../assets/questions/quienesmasprobable.json";
// import siJugador from "../../../assets/questions/sijugador.json";

import socket from "../../../utils/socket";

//TODO: LIMITAR Nº PREGRUNTAS
const Room = () => {
  const { partida } = useParams();
  const navigate = useNavigate();
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  const [questionsList, setQuestionsList] = useState<any>([]);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [players, setPlayers] = useState<any>([]);
  const [finish, setFinish] = useState<boolean>(false);
  // const hasSentResponse = useRef(false);
  useEffect(() => {
    getListQuestion();
  }, []);

  useEffect(() => {
    if (!partida) return;

    socket.emit("getNQuestion", { partida });

    const getPlayersList = (playersList: any) => {
      setPlayers(playersList);
    };

    const getQuestionsList = (questions: any) => {
      setQuestionsList(questions);
    };
    const questionSelected = (questionId: any) => {
      setIndexQuestion(questionId);
    };

    socket.on("questionStart", questionSelected);

    socket.on("playersList", getPlayersList);
    socket.on("getQuestionsList", getQuestionsList);

    return () => {
      socket.off("questionStart", questionSelected);
      socket.off("playersList", getPlayersList);
      socket.off("getQuestionsList", getQuestionsList);
    };
  }, []);

  useEffect(() => {
    //funciina
    // if (response && timeOut && !hasSentResponse.current) {
    //   sendResponse(response);
    //   hasSentResponse.current = true;
    // }
    if (response) {
      sendResponse(response);
    }

    if (response && timeOut) {
      goResult();
      // hasSentResponse.current = true;
    }
  }, [response, timeOut]);

  const getListQuestion = async () => {
    const questionsListWho = getQuestionsRandom(quienEsMasProbable.preguntas);
    //TODO: CONCADENAR TIPO RESPUESTA
    // const questionsListIf = getQuestionsRandom(siJugador.preguntas);
    // const list = questionsListWho.concat(questionsListIf);
    const list = questionsListWho;

    if (finish) {
      setFinish(true);
    }
    const numRandom = getRandomInt(list.length);

    socket.emit("questionChoose", { partida, numRandom });
    socket.emit("questionsList", { partida, list });
  };

  //TODO: PROBAR QUIEN SERIA
  const sendResponse = (resp: any) => {
    if (resp) {
      const nameRandom = getNameRandom(players);
      socket.emit("nameRandom", { partida, nameRandom });

      switch (resp.type) {
        case "QUIEN_SERIA":
          sendResponseWhoIsPlayer(resp.resp);
          break;
        case "RESPUESTA":
          // sendResponseResp(user, resp);
          break;
      }
    }
  };

  const goResult = () => {
    navigate(`/resultado/${partida}`);
  };

  const sendResponseWhoIsPlayer = (resp: string) => {
    const respuesta = {
      preguntaId: indexQuestion || 0,
      respuesta: resp,
    };

    socket.emit("saveLastResp", { partida, respuesta });
    socket.emit("saveResp", { partida, respuesta });
    // navigate(`/resultado/${partida}`);
  };

  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
        <CountDown seconds={15} onTimeOut={setTimeOut} />
        <Questions
          timeOut={timeOut}
          onResponse={setResponse}
          questionsList={questionsList}
          numRandom={indexQuestion}
          questionId={indexQuestion}
        />
      </div>
    </>
  );
};

export default Room;
