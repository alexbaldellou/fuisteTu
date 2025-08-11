import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../../../utils/socket";
import { QuestionsProps } from "./Questions";

export const QuestionsController = (props: QuestionsProps) => {
  const {
    onResponse,
    questionId,
    questionsList,
    isQuestionResp,
    onIsResp,
    onGoResult,
  } = props;
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
      if (textQuestion.type === "RESPUESTA") {
        setQuestionText(textQuestion.question);
        onIsResp(true);
      } else {
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
      setQuestionText("");
    }
  }, [isQuestionResp]);

  return {
    questionText,
    question,
    players,
    choosePlayer,
    questionsListResp,
    setRespChoose,
    setChoosePlayer,
  };
};
