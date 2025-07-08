import { Button, Input } from "@nextui-org/react";
import ListPlayers from "../Players/ListPlayers";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { urlDefault } from "../../../config";
import { RegisterPlayer } from "../Player/RegisterPlayer";
import socket from "../../../utils/socket";
import { JugadorInterface } from "../../../Interface/JugadorInterface";
const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [url, setUrl] = useState("");
  const [isSave, setIsSave] = useState<boolean>(false);
  const [jugador, setJugador] = useState<JugadorInterface>(
    {} as JugadorInterface
  );
  const [players, setPlayers] = useState<any>([]);

  useEffect(() => {
    if (id) {
      setUrl(`${urlDefault}/registro/${id}`);
      localStorage.setItem("typeUser", "host");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const handleUpdate = (playersList: any) => {
      setPlayers(playersList);
    };

    socket.on("playersInRoom", handleUpdate);

    return () => {
      socket.off("playersInRoom", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (isSave) {
      console.log("Nuevo registro");
      socket.emit("register", { id, jugador });
    }
  }, [id, jugador]);

  const empezarPartida = () => {
    if (id) {
      navigate(`/sala/${id}`);
    }
  };

  return (
    <div className="md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500 flex justify-center items-center flex-col">
      <div className="flex flex-row">
        <div className="w-1/2">
          <RegisterPlayer
            partidaId={id || ""}
            onChangePlayer={setJugador}
            onSave={setIsSave}
          />
        </div>
        <div className="w-1/2">
          <ListPlayers playersList={players} />
        </div>
      </div>

      <Button
        color="secondary"
        variant="shadow"
        className="font-bold my-10 text-2xl p-7"
        onClick={empezarPartida}
      >
        EMPEZAR LA LOCURA
      </Button>
      <div className="w-4/12">
        <Input label="Comparte la URL a los demás" value={url} />
      </div>
    </div>
  );
};
export default Home;
