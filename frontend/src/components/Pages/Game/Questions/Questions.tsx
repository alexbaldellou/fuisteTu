import { useEffect, useState } from "react";
import WhoIsQuestion from "./TypeQuestions/WhoIsQuestion";
import ResponseQuestion from "./TypeQuestions/ResponseQuestion/ResponseQuestion";
import socket from "../../../../utils/socket";
import { useParams } from "react-router-dom";

interface QuestionsProps {
  timeOut: boolean;
  numRandom?: number;
  questionId: number;
  questionsList: any[];
  onResponse: (resp: any) => void;
  questionChoose?: (resp: any) => void;
}

const Questions = (props: QuestionsProps) => {
  const { timeOut, onResponse, questionId, questionsList } = props;
  const { partida } = useParams();
  const [choosePlayer, setChoosePlayer] = useState<string>("");
  const [respChoose, setRespChoose] = useState<string>("");
  const [nameRandom, setNameRandom] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [players, setPlayers] = useState<any>([]);

  useEffect(() => {
    socket.emit("playersList", { partida });

    const getNameRandom = (name: any) => {
      setNameRandom(name);
    };

    const getPlayersList = (playersList: any) => {
      setPlayers(playersList);
    };

    socket.on("getNameRandom", getNameRandom);
    socket.on("getPlayersList", getPlayersList);
  }, []);

  useEffect(() => {
    if ((choosePlayer || respChoose) && timeOut) {
      if (choosePlayer) {
        onResponse({ resp: choosePlayer, type: "QUIEN_SERIA" });
      } else if (respChoose) {
        const choose = respChoose || "";
        onResponse({ resp: choose, type: "RESPUESTA" });
      }
    }
  }, [choosePlayer, timeOut, respChoose]);

  useEffect(() => {
    if (players.length > 0) {
      setQuestion(questionsList.find((_, i) => i === questionId));
    }
  }, [players]);

  useEffect(() => {
    if (questionId && questionsList.length > 0) {
      setQuestion(questionsList.find((_, i) => i === questionId));
    }
  }, [questionId, questionsList]);

  return (
    <div className="bg-white/10 border-white/10 shadow-sm w-9/12 rounded-3xl">
      <form className="flex flex-col justify-center gap-4 items-center my-10">
        {question && question.includes("%jugador%") ? (
          <ResponseQuestion
            question={question || ""}
            onChooseResp={setRespChoose}
            nameRandom={nameRandom}
          />
        ) : (
          <WhoIsQuestion
            question={question || ""}
            playerList={players}
            onChoosePlayer={setChoosePlayer}
          />
        )}
      </form>
    </div>
  );
};

export default Questions;
