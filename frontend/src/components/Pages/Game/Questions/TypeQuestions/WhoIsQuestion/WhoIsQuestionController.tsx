import { useEffect, useState } from "react";
import { WhoIsQuestionProps } from "./WhoIsQuestion";

export const WhoIsQuestionController = (props: WhoIsQuestionProps) => {
  const { question, playerList, player, onChoosePlayer, questionsListResp } =
    props;
  const [playerSelected, setPlayerSelected] = useState<string>(player);

  useEffect(() => {
    if (playerSelected) {
      onChoosePlayer(playerSelected);
    }
  }, [playerSelected]);

  const onChoose = (player: string) => {
    setPlayerSelected(player);
  };

  return {
    question,
    playerList,
    questionsListResp,
    playerSelected,
    setPlayerSelected,
    onChoose,
  };
};
