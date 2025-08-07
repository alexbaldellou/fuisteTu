import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardPlayer from "../../../commons/CardPlayer";
import Winner from "./Winner";

import socket from "../../../../utils/socket";

const FinishGame = () => {
  const [players, setPlayers] = useState<any>([]);
  const [playerWin, setPlayerWin] = useState<any>({});
  const { partida } = useParams();

  useEffect(() => {
    socket.emit("playersList", { partida });

    const getPlayersList = (playersList: any) => {
      setPlayers(playersList);
    };

    socket.on("getPlayersList", getPlayersList);
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      getPlayerWin(players);
    }
  }, [players]);

  const getPlayerWin = (list: any) => {
    let mayorPuntuacion = 0;
    let playerW = {};

    list.forEach((player: any) => {
      if (player.puntos > mayorPuntuacion) {
        playerW = player;
        mayorPuntuacion = player.puntos;
      }
    });
    setPlayerWin(playerW);
  };

  return (
    <div className="w-full flex justify-center items-center flex-col py-14 md:h-dvh bg-gradient-to-tr from-pink-500 to-yellow-500">
      <Winner player={playerWin} />
      <div className="flex gap-9 flex-wrap w-3/6">
        {players &&
          players.map((player: any, i: number) => {
            return <CardPlayer key={i} player={player} />;
          })}
      </div>
    </div>
  );
};

export default FinishGame;
