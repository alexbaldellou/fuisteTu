import { useEffect, useState } from "react";
// import { gameService, playersService } from "../../../services/allService";
import Questions from "./Questions/Questions";
import CountDown from "./CountDown/CountDown";
import { useParams } from "react-router-dom";
// import FinishGame from "./FinishGame/FinishGame";
// import ResponseChooseQuestion from "./Questions/TypeQuestions/ResponseQuestion/ResponseChooseQuestion";
import { getQuestionsRandom, getRandomInt } from "../../Utils";

import quienEsMasProbable from "../../../assets/questions/quienesmasprobable.json";
import siJugador from "../../../assets/questions/sijugador.json";

import socket from "../../../utils/socket";

const Room = () => {
  // const user = localStorage.getItem("id");
  // const navigate = useNavigate();
  const { partida } = useParams();
  // const [listPlayer, setLisPlayer] = useState<any>([]);
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  // const [chooseResponse, setChooseResponse] = useState<boolean>(false);
  const [question, setQuestion] = useState<any>();
  const [questionRandom, setQuestionRandom] = useState<any>([]);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [players, setPlayers] = useState<any>([]);
  // const [isStartGame, setIsStartGame] = useState<boolean>(false);
  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => {
    // getListPlayers();
    getListQuestion();
  }, []);

  useEffect(() => {
    if (!partida) return;

    const handleUpdate = (playersList: any) => {
      setPlayers(playersList);
    };

    socket.on("playersInRoom", handleUpdate);

    // const handleIsStartGame = (isStart: any) => {
    //   setIsStartGame(isStart);
    // };

    // socket.on("isStartGame", handleIsStartGame);

    // return () => {
    //   socket.off("playersInRoom", handleUpdate);
    //   socket.off("isStartGame", handleIsStartGame);
    // };
  }, []);

  // useEffect(() => {
  //   if (response && timeOut) {
  //     sendResponse(response);
  //   }
  // }, [response, timeOut]);

  // const getListPlayers = async () => {
  //   const list = (await playersService.getListPlayers(partida || "")).docs.map(
  //     (doc) => doc.data()
  //   );
  //   setLisPlayer(list);
  // };

  const getListQuestion = async () => {
    const questionsListWho = getQuestionsRandom(quienEsMasProbable.preguntas);
    const questionsListIf = getQuestionsRandom(siJugador.preguntas);
    const list = questionsListWho.concat(questionsListIf);

    if (finish) {
      setFinish(true);
    }
    const numRandom = getRandomInt(list.length);
    console.log(numRandom);
    setQuestionRandom(list.find((_, i) => i === numRandom));
    setIndexQuestion(getRandomInt(list.length));
  };

  //TODO: SABER SI ES QUIEN SERIA O RESPUESTA
  // const sendResponse = (resp: any) => {
  //   if (user && resp) {
  //     setStatusQuestion();
  //     switch (resp.type) {
  //       case "QUIEN_SERIA":
  //         sendResponseWhoIsPlayer(user, resp);
  //         break;
  //       case "RESPUESTA":
  //         sendResponseResp(user, resp);
  //         break;
  //     }
  //   }
  // };

  // const sendResponseWhoIsPlayer = (user: any, resp: string) => {
  //   playersService.setChooseJugador(user, { respuesta: resp });
  //   navigate(`/resultado/${partida}`);
  // };

  // const sendResponseResp = (user: any, resp: string) => {
  //   playersService.setChooseJugador(user, { respuesta: resp });
  //   setChooseResponse(true);
  //   navigate(`/resultado/${partida}`);
  // };

  // const setStatusQuestion = async () => {
  //   if (question.id) {
  //     await gameService.updateQuestion(question.id, { activo: false });
  //   }
  // };

  console.log("question", question);
  console.log("response", response);
  console.log("players", players);
  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
        <CountDown seconds={15} onTimeOut={setTimeOut} />
        <Questions
          players={players}
          timeOut={timeOut}
          onResponse={setResponse}
          game={partida}
          numRandom={indexQuestion}
          question={questionRandom}
          questionChoose={setQuestion}
        />
      </div>
      {/* <p>ajsdso</p> */}
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
