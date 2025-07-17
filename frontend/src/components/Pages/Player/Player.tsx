import { useParams } from "react-router-dom";
import { RegisterPlayer } from "./RegisterPlayer";
import ListPlayers from "../Players/ListPlayers";
import { useEffect, useState } from "react";
import socket from "../../../utils/socket";
import { JugadorInterface } from "../../../Interface/JugadorInterface";

const Player = () => {
  const { partida } = useParams();
  const [players, setPlayers] = useState<any>([]);
  const [jugador, setJugador] = useState<JugadorInterface>(
    {} as JugadorInterface
  );
  const [isSave, setIsSave] = useState<boolean>(false);
  useEffect(() => {
    if (!partida) return;

    const handleUpdate = (playersList: any) => {
      setPlayers(playersList);
    };

    const saveIdPlayer = (id: any) => {
      console.log('socket.on("getId", saveIdPlayer);', id);
      localStorage.setItem("id", id);
    };

    socket.on("playersInRoom", handleUpdate);
    socket.on("getId", saveIdPlayer);

    return () => {
      socket.off("playersInRoom", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (isSave) {
      console.log("Nuevo registro");
      // Unirse a la sala (esto puede estar en otro componente también)
      socket.emit("register", { partida, jugador });
    }
  }, [partida, jugador]);

  return (
    <div className="md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500 flex justify-center items-center flex-col">
      <div className="flex flex-row">
        <div className="w-1/2">
          <RegisterPlayer
            partidaId={partida || ""}
            onChangePlayer={setJugador}
            onSave={setIsSave}
          />
        </div>
        <div className="w-1/2">
          <ListPlayers playersList={players} />
        </div>
      </div>
    </div>
  );
};

export default Player;
