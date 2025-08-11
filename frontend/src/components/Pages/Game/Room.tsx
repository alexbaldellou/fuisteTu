import { useEffect, useState } from "react";
import Questions from "./Questions/Questions";
import CountDown from "./CountDown/CountDown";
import { useParams, useNavigate } from "react-router-dom";
import { getNameRandom } from "../../Utils";

import socket from "../../../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { addQuestions } from "../../../redux/questionsList";
import { ResumePoints } from "./ResumePoints/ResumePoints";

const Room = () => {
  const { partida } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(15);
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();
  const [questionsList, setQuestionsList] = useState<any>([]);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [isQuestionResp, setIsQuestionResp] = useState<boolean>(false);
  const [isGoResult, setIsGoResult] = useState<boolean>(false);
  const [finish, setFinish] = useState<boolean>(false);
  const players = useSelector((state: any) => state.players.players);
  const user = useSelector((state: any) => state.user.nombre);

  useEffect(() => {
    if (!partida) return;

    if (finish) {
      setFinish(true);
    }
    socket.emit("getNQuestion", { partida });
    socket.emit("getQuestionsList", { partida });

    const getQuestionsList = (questions: any) => {
      setIndexQuestion(questions.numRandom);
      setQuestionsList(questions.questionsList);
    };

    socket.on("getQuestionsList", getQuestionsList);

    return () => {
      socket.off("getQuestionsList", getQuestionsList);
    };
  }, []);

  useEffect(() => {
    if (response) {
      sendResponse(response);
    }

    if (response && timeOut && !isQuestionResp) {
      setTime(15);
      setTimeOut(false);
      setIsQuestionResp(true);
    }

    if (response && timeOut && isGoResult) {
      goResult();
    }
  }, [response, timeOut, isQuestionResp]);

  useEffect(() => {
    if (players && players.length > 0) {
      getTheNameRandom();
    }
  }, [players]);

  useEffect(() => {
    if (questionsList.length > 0) {
      dispatch(addQuestions(questionsList));
    }
  }, [questionsList]);

  const getTheNameRandom = async () => {
    const nameRandom = await getNameRandom(players);
    socket.emit("nameRandom", { partida, nameRandom });
  };

  const sendResponse = (resp: any) => {
    if (resp) {
      switch (resp.type) {
        case "QUIEN_SERIA":
          sendResponseWhoIsPlayer(resp.resp);
          break;
        case "RESPUESTA":
          sendResponseResp(user, resp);
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
    console.log("respuesta", respuesta);
    socket.emit("saveResp", { partida, respuesta });
    setIsQuestionResp(false);
  };

  const sendResponseResp = (user: string, resp: string) => {
    const respuesta = {
      preguntaId: indexQuestion || 0,
      jugador: user,
      respuesta: resp,
    };

    socket.emit("saveQuestionResp", { partida, respuesta });
  };

  const onIsResp = (resp: boolean) => {
    if (resp) setTime(30);
  };
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
      {!isQuestionResp ? (
        <>
          <CountDown key={time} seconds={time} onTimeOut={setTimeOut} />
          <Questions
            onResponse={setResponse}
            questionsList={questionsList}
            numRandom={indexQuestion}
            questionId={indexQuestion}
            isQuestionResp={isQuestionResp}
            onIsResp={onIsResp}
            onGoResult={setIsGoResult}
          />
        </>
      ) : (
        <>
          <CountDown key={time} seconds={time} onTimeOut={setTimeOut} />
          <Questions
            onResponse={setResponse}
            questionsList={questionsList}
            numRandom={indexQuestion}
            questionId={indexQuestion}
            isQuestionResp={isQuestionResp}
            onIsResp={onIsResp}
            onGoResult={setIsGoResult}
          />
        </>
      )}
      <ResumePoints />
    </div>
  );
};

export default Room;
