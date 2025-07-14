import { useEffect, useState } from "react";
import Questions from "./Questions/Questions";
import CountDown from "./CountDown/CountDown";
import { useParams, useNavigate } from "react-router-dom";
// import FinishGame from "./FinishGame/FinishGame";
// import ResponseChooseQuestion from "./Questions/TypeQuestions/ResponseQuestion/ResponseChooseQuestion";
import { getNameRandom, getQuestionsRandom, getRandomInt } from "../../Utils";

import quienEsMasProbable from "../../../assets/questions/quienesmasprobable.json";
import siJugador from "../../../assets/questions/sijugador.json";

import socket from "../../../utils/socket";

const Room = () => {
  const { partida } = useParams();
  const navigate = useNavigate();
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  const [question, setQuestion] = useState<any>();
  const [questionsList, setQuestionsList] = useState<any>([]);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [players, setPlayers] = useState<any>([]);
  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => {
    getListQuestion();
  }, []);

  useEffect(() => {
    if (!partida) return;

    const getPlayersList = (playersList: any) => {
      setPlayers(playersList);
    };

    const questionSelected = (questionId: any) => {
      setIndexQuestion(questionId);
    };

    const getQuestionsList = (questions: any) => {
      setQuestionsList(questions);
    };

    socket.on("playersList", getPlayersList);
    socket.on("questionStart", questionSelected);
    socket.on("getQuestionsList", getQuestionsList);
  }, []);

  useEffect(() => {
    if (response && timeOut) {
      sendResponse(response);
    }
  }, [response, timeOut]);

  // const getListPlayers = async () => {
  //   const list = (await playersService.getListPlayers(partida || "")).docs.map(
  //     (doc) => doc.data()
  //   );
  //   setLisPlayer(list);
  // };

  const getListQuestion = async () => {
    const questionsListWho = getQuestionsRandom(quienEsMasProbable.preguntas);
    //TODO: CONCADENAR TIPO RESPUESTA
    const questionsListIf = getQuestionsRandom(siJugador.preguntas);
    const list = questionsListWho.concat(questionsListIf);
    // const list = questionsListWho;

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
      navigate(`/resultado/${partida}`);
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

  const sendResponseWhoIsPlayer = (resp: string) => {
    const respuesta = {
      preguntaId: indexQuestion,
      respuesta: resp,
    };
    console.log("respuesta", respuesta);
    socket.emit("saveResp", { partida, respuesta });
    navigate(`/resultado/${partida}`);
  };

  // const sendResponseResp = (user: any, resp: string) => {
  //   playersService.setChooseJugador(user, { respuesta: resp });
  //   setChooseResponse(true);
  //   navigate(`/resultado/${partida}`);
  // };

  console.log(question);
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
          questionChoose={setQuestion}
        />
      </div>
      {/* {finish ? (
        <FinishGame />
      ) : !chooseResponse ? (
        <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
          <CountDown seconds={15} onTimeOut={setTimeOut} />
          <Questions
            players={listPlayer}
            timeOut={timeOut}
            onResponse={setResponse}
            game={partida}
            numRandom={indexQuestion}
            question={questionRandom}
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
            numRandom={indexQuestion}
            // finishGame={setFinish}
          /> 
        </div>
      )} */}
    </>
  );
};

export default Room;
