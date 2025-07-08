import { useEffect, useState } from "react";
import WhoIsQuestion from "./TypeQuestions/WhoIsQuestion";
import ResponseQuestion from "./TypeQuestions/ResponseQuestion/ResponseQuestion";

interface QuestionsProps {
  players: [];
  timeOut: boolean;
  numRandom?: number;
  game: string | undefined;
  question: string;
  onResponse: (resp: any) => void;
  questionChoose?: (resp: any) => void;
}

const Questions = (props: QuestionsProps) => {
  const { players, timeOut, game, onResponse, question } = props;

  const typeUser = localStorage.getItem("typeUser");
  const [choosePlayer, setChoosePlayer] = useState<string>("");
  const [respChoose, setRespChoose] = useState<string>("");
  const [typeQuestion, setTypeQuestion] = useState<string>("");
  const nameRandom = players[Math.floor(Math.random() * players.length)];
  console.log("typeUser", typeUser);
  console.log("players", players);
  // useEffect(() => {
  //   if ((choosePlayer || respChoose) && timeOut) {
  //     if (choosePlayer) {
  //       const choose = choosePlayer || Math.random().toString();
  //       onResponse({ resp: choose, type: "QUIEN_SERIA" });
  //     } else if (respChoose) {
  //       const choose = respChoose || "";
  //       onResponse({ resp: choose, type: "RESPUESTA" });
  //     }
  //   }
  // }, [choosePlayer, timeOut, respChoose]);

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
