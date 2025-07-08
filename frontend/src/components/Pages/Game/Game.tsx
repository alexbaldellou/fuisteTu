import { useEffect, useState } from "react";
import { gameService, playersService } from "../../../services/allService";
import Questions from "./Questions/Questions";
import CountDown from "./CountDown/CountDown";
import { useNavigate, useParams } from "react-router-dom";
import FinishGame from "./FinishGame/FinishGame";
import ResponseChooseQuestion from "./Questions/TypeQuestions/ResponseQuestion/ResponseChooseQuestion";
import { getQuestionsRandom, getRandomInt } from "../../Utils";

import quienEsMasProbable from "../../../assets/questions/quienesmasprobable.json";
import siJugador from "../../../assets/questions/sijugador.json";

const Game = () => {
  const user = localStorage.getItem("id");
  const typeUser = localStorage.getItem("typeUser");
  const navigate = useNavigate();
  const { partida } = useParams();
  const [listPlayer, setLisPlayer] = useState<any>([]);
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  const [chooseResponse, setChooseResponse] = useState<boolean>(false);
  const [question, setQuestion] = useState<any>();
  const [questionRandom, setQuestionRandom] = useState<any>([]);
  const [numRandom, setNumRandom] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => {
    getListPlayers();
    getListQuestion();
  }, []);

  useEffect(() => {
    if (questionRandom && partida && typeUser === "host") {
      setQuestionGame(partida, questionRandom); // recoge question random
    }
  }, [questionRandom]);

  useEffect(() => {
    if (response && timeOut) {
      sendResponse(response);
    }
  }, [response, timeOut]);

  const getListPlayers = async () => {
    const list = (await playersService.getListPlayers()).docs.map((doc) =>
      doc.data()
    );
    setLisPlayer(list.filter((data: any) => data.partida === partida));
  };

  const getListQuestion = async () => {
    const questionsListWho = getQuestionsRandom(quienEsMasProbable.preguntas);
    const questionsListIf = getQuestionsRandom(siJugador.preguntas);
    const list = questionsListWho.concat(questionsListIf);
    // const list = (await gameService.getListQuestions()).docs
    //   .map((doc) => doc.data())
    //   .filter((val) => val.activo);
    // if (finish) {
    setFinish(true);
    // }
    const numRandom = getRandomInt(list.length);

    setQuestionRandom(list.find((data) => data.id === numRandom.toString()));
    setNumRandom(getRandomInt(list.length));
  };
  //TODO: SABER SI ES QUIEN SERIA O RESPUESTA
  const sendResponse = (resp: any) => {
    if (user && resp) {
      setStatusQuestion();
      switch (resp.type) {
        case "QUIEN_SERIA":
          sendResponseWhoIsPlayer(user, resp);
          break;
        case "RESPUESTA":
          sendResponseResp(user, resp);
          break;
      }
    }
  };

  const setQuestionGame = async (partida: string, question: string) => {
    await gameService.updateGame(partida, { preguntaActual: question });
  };

  const sendResponseWhoIsPlayer = (user: any, resp: string) => {
    playersService.setChooseJugador(user, { respuesta: resp });
    navigate(`/resultado/${partida}`);
  };

  const sendResponseResp = (user: any, resp: string) => {
    playersService.setChooseJugador(user, { respuesta: resp });
    setChooseResponse(true);
    // navigate(`/resultado/${partida}`);
  };

  const setStatusQuestion = async () => {
    if (question.id) {
      await gameService.updateQuestion(question.id, { activo: false });
    }
  };

  return (
    <>
      {finish ? (
        <FinishGame />
      ) : !chooseResponse ? (
        <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
          <CountDown seconds={15} onTimeOut={setTimeOut} />
          <Questions
            players={listPlayer}
            timeOut={timeOut}
            onResponse={setResponse}
            game={partida}
            question={questionRandom} // debe cargar question de la partida
            numRandom={numRandom}
            questionChoose={setQuestion}
          />
        </div>
      ) : (
        <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
          <CountDown seconds={15} onTimeOut={setTimeOut} />
          <ResponseChooseQuestion partida={partida} />
          <Questions
            players={listPlayer}
            timeOut={timeOut}
            onResponse={setResponse}
            questionChoose={setQuestion}
            game={partida}
            question={questionRandom}
            numRandom={numRandom}
            // finishGame={setFinish}
          />
        </div>
      )}
    </>
  );
};

export default Game;
