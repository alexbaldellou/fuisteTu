import { useEffect, useState } from "react";
import WhoIsQuestion from "./TypeQuestions/WhoIsQuestion";
import ResponseQuestion from "./TypeQuestions/ResponseQuestion/ResponseQuestion";

interface QuestionsProps {
  players: [];
  timeOut: boolean;
  numRandom?: number;
  questionId: number;
  questionsList: any[];
  onResponse: (resp: any) => void;
  questionChoose?: (resp: any) => void;
}

const Questions = (props: QuestionsProps) => {
  const { players, timeOut, onResponse, questionId, questionsList } = props;

  const [choosePlayer, setChoosePlayer] = useState<string>("");
  const [respChoose, setRespChoose] = useState<string>("");
  const nameRandom = players[Math.floor(Math.random() * players.length)];
  const [question, setQuestion] = useState<string>("");

  useEffect(() => {
    if ((choosePlayer || respChoose) && timeOut) {
      if (choosePlayer) {
        const choose = choosePlayer || Math.random().toString();
        onResponse({ resp: choose, type: "QUIEN_SERIA" });
      } else if (respChoose) {
        const choose = respChoose || "";
        onResponse({ resp: choose, type: "RESPUESTA" });
      }
    }
  }, [choosePlayer, timeOut, respChoose]);

  useEffect(() => {
    if (questionId && questionsList.length > 0) {
      setQuestion(questionsList.find((_, i) => i === questionId));
    }
  }, [questionId, questionsList]);

  return (
    <div className="bg-white/10 border-white/10 shadow-sm w-9/12 rounded-3xl">
      <form className="flex flex-col justify-center gap-4 items-center my-10">
        {question.includes("%jugador%") ? (
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
