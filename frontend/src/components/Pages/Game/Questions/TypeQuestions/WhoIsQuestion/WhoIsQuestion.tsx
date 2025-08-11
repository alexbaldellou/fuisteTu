import CardPlayer from "../../../../../commons/CardPlayer";
import { WhoIsQuestionController } from "./WhoIsQuestionController";

export interface WhoIsQuestionProps {
  question: string;
  playerList: any;
  player: string;
  onChoosePlayer: (player: string) => void;
  questionsListResp: any;
}

const WhoIsQuestion = (props: WhoIsQuestionProps) => {
  const {
    question,
    playerList,
    questionsListResp,
    playerSelected,
    setPlayerSelected,
    onChoose,
  } = WhoIsQuestionController(props);
  return (
    <div className="w-5/6">
      <h3 className="text-white font-bold text-3xl text-center my-10 mx-5">
        {question}
      </h3>
      <div className="flex gap-9 flex-wrap w-full">
        {questionsListResp.length > 0 ? (
          questionsListResp.map((questionResp: any, i: number) => {
            return (
              <CardPlayer
                key={i}
                player={
                  questionResp.respuestaSiFuera
                    ? questionResp.respuestaSiFuera.respuesta
                    : ""
                }
                click={onChoose}
                playerSelected={playerSelected}
                onChoosePlayer={setPlayerSelected}
                isQuestionResp={true}
              />
            );
          })
        ) : (
          <>
            {playerList.map((player: any, i: number) => {
              return (
                <CardPlayer
                  key={i}
                  player={player}
                  click={onChoose}
                  playerSelected={playerSelected}
                  onChoosePlayer={setPlayerSelected}
                  isQuestionResp={false}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default WhoIsQuestion;
