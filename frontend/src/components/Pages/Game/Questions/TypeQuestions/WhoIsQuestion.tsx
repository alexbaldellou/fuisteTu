import { useState } from "react";
import CardPlayer from "../../../../commons/CardPlayer";

interface WhoIsQuestionProps {
  question: string;
  playerList: any;
  onChoosePlayer: (player: string) => void;
}

const WhoIsQuestion = (props: WhoIsQuestionProps) => {
  const { question, playerList, onChoosePlayer } = props;
  const [playerSelected, setPlayerSelected] = useState<string>("");

  const onChoose = (player: string) => {
    onChoosePlayer(player);
    setPlayerSelected(player);
  };

  return (
    <div>
      <h3 className="text-white font-bold text-3xl text-center my-10 mx-5">
        {question}
      </h3>
      <div className="flex gap-9 flex-wrap w-full">
        {playerList.map((player: any, i: number) => {
          return (
            <>
              <CardPlayer
                key={i}
                player={player}
                click={onChoose}
                playerSelected={playerSelected}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default WhoIsQuestion;
