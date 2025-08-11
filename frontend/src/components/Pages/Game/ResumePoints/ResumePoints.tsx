import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../../../utils/socket";

export const ResumePoints = () => {
  const { partida } = useParams();
  const [players, setPlayers] = useState<any>([]);

  useEffect(() => {
    socket.emit("playersList", { partida });

    const getPlayersList = (playersList: any) => {
      setPlayers(playersList);
    };

    socket.on("getPlayersList", getPlayersList);

    return () => {
      socket.off("getPlayersList", getPlayersList);
    };
  }, []);
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {players.map((player: any, index: number) => (
        <div
          key={index}
          className="flex flex-col rounded-lg bg-white p-4 shadow-lg w-auto text-center"
        >
          <div className="flex flex-row gap-2 items-center">
            <img src={player.url} alt={player.jugador} className="w-20" />
            <div className="text-xl font-bold text-start">
              {player.nombre}
              <span className="text-orange-600 block">{player.puntos}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
