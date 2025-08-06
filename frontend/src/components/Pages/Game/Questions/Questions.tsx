import { useEffect, useState } from "react";
import WhoIsQuestion from "./TypeQuestions/WhoIsQuestion";
import ResponseQuestion from "./TypeQuestions/ResponseQuestion/ResponseQuestion";
import socket from "../../../../utils/socket";
import { useParams } from "react-router-dom";

interface QuestionsProps {
  numRandom?: number;
  questionId: number;
  questionsList: any[];
  onResponse: (resp: any) => void;
  onIsResp: (resp: any) => void;
  onGoResult: (resp: any) => void;
  isQuestionResp: boolean;
}

const Questions = (props: QuestionsProps) => {
  const { onResponse, questionId, questionsList, isQuestionResp, onIsResp, onGoResult } = props;
  const { partida } = useParams();
  const [choosePlayer, setChoosePlayer] = useState<string>("");
  const [respChoose, setRespChoose] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [players, setPlayers] = useState<any>([]);
  const [questionsListResp, setQuestionsListResp] = useState<any>([]);

  useEffect(() => {
    socket.emit("playersList", { partida });

    const getPlayersList = (playersList: any) => {
      setPlayers(playersList);
    };

    const getQuestionsListResp = (questionsListResp: any) => {
      setQuestionsListResp(questionsListResp);
    };

    socket.on("getPlayersList", getPlayersList);
    socket.on("getQuestionsListResp", getQuestionsListResp);
    return () => {
      socket.off("getPlayersList", getPlayersList);
    };
  }, []);

  useEffect(() => {
   
      if (questionId && questionsList.length > 0) {
        const textQuestion = questionsList.find((_, i) => i === questionId);
        if (textQuestion.type === 'RESPUESTA') {
          setQuestionText(textQuestion.question);
          onIsResp(true);
        }else{
          onIsResp(false);
          setQuestion(textQuestion.question);
        }
      }
    
  }, [questionId, questionsList]);

  useEffect(() => {
    if (choosePlayer || respChoose) {
      if (choosePlayer) {
        onGoResult(true);
        onResponse({ resp: choosePlayer, type: "QUIEN_SERIA" });
      } else if (respChoose) {
        onGoResult(false);
        const choose = respChoose || "";
        onResponse({ nombre: choose, type: "RESPUESTA" });
      }
    }
  }, [choosePlayer, respChoose]);

  useEffect(() => {
    if (isQuestionResp) {
      setQuestionText('');
    }
  }, [isQuestionResp]);
  
  return (
    <div className="bg-white/10 border-white/10 shadow-sm w-9/12 rounded-3xl">
      <form className="flex flex-col justify-center gap-4 items-center my-10">
        {questionText !== "" ? (
          <ResponseQuestion
            question={questionText}
            onChooseResp={setRespChoose}
          />
        ) : (
          <WhoIsQuestion
            key={Math.random()}
            question={question || ""}
            playerList={players}
            player={choosePlayer}
            onChoosePlayer={setChoosePlayer}
            questionsListResp={questionsListResp}
          />
        )}
      </form>
    </div>
  );
};

export default Questions;
