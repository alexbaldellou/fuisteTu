import WhoIsQuestion from "./TypeQuestions/WhoIsQuestion/WhoIsQuestion";
import ResponseQuestion from "./TypeQuestions/ResponseQuestion/ResponseQuestion";
import { QuestionsController } from "./QuestionsController";

export interface QuestionsProps {
  numRandom?: number;
  questionId: number;
  questionsList: any[];
  onResponse: (resp: any) => void;
  onIsResp: (resp: any) => void;
  onGoResult: (resp: any) => void;
  isQuestionResp: boolean;
}

const Questions = (props: QuestionsProps) => {
  const {
    questionText,
    question,
    players,
    choosePlayer,
    questionsListResp,
    setRespChoose,
    setChoosePlayer,
  } = QuestionsController(props);

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
