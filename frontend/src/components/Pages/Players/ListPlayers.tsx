// import { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
// import { playersService } from "../../../services/allService";
// import { useParams } from "react-router-dom";
// import socket from "../../../utils/socket";
// import { useParams } from "react-router-dom";

interface ListPlayersProps {
  partida?: string;
  playersList?: any;
}
const ListPlayers = (props: ListPlayersProps) => {
  const { playersList } = props;
  // const { roomId } = useParams();
  // const [players, setPlayers] = useState<any>([]);

  // useEffect(() => {
  //   // if (!partida) return;

  //   // Unirse a la sala si aún no estamos
  //   socket.emit("getPlayersInRoom", partida);

  //   socket.on("playersInRoom", (playersList) => {
  //     console.log("playersList: ", playersList);
  //     setPlayers(playersList);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!roomId) return;

  //   // Unirse a la sala (esto puede estar en otro componente también)
  //   socket.emit("register", { roomId, username: "Jugador" + socket.id });

  //   const handleUpdate = (playersList: any) => {
  //     setPlayers(playersList);
  //   };

  //   socket.on("playersInRoom", handleUpdate);

  //   return () => {
  //     socket.off("playersInRoom", handleUpdate);
  //   };
  // }, [roomId]);

  return (
    <>
      <div className="bg-white/10 border-white/10 shadow-sm flex-column  rounded-3xl flex-wrap  h-full p-3 ml-3">
        <h3 className="text-white font-bold text-3xl text-center mb-10">
          Los panas que no tienen miedo al éxito
        </h3>
        <div className="my-10">
          {playersList &&
            playersList.map((val: any, i: number) => {
              return (
                <div
                  key={i}
                  className="flex items-center mx-3 bg-white my-3 p-3 rounded-2xl"
                >
                  <Avatar
                    key={i}
                    isBordered
                    color="default"
                    src={val.url}
                    className="w-16 h-16 text-large bg-violet-400"
                  />
                  <h3 className="text-violet-900 font-bold text-2xl ml-5">
                    {val.nombre}
                  </h3>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ListPlayers;
