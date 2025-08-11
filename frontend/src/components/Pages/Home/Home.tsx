import { Button, Input } from "@nextui-org/react";
import ListPlayers from "../Players/ListPlayers";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { urlDefault } from "../../../config";
import { RegisterPlayer } from "../Player/RegisterPlayer";
import socket from "../../../utils/socket";
import { JugadorInterface } from "../../../Interface/JugadorInterface";
import { getNameRandom, getPreguntas } from "../../Utils";
import { useDispatch } from "react-redux";
import { addQuestions } from "../../../redux/questionsList";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, typePlayer } = useParams();
  const [url, setUrl] = useState("");
  const [nPreguntas, setNPreguntas] = useState(2);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [copiado, setCopiado] = useState(false);
  const [jugador, setJugador] = useState<JugadorInterface>(
    {} as JugadorInterface
  );
  const [players, setPlayers] = useState<any>([]);
  const [preguntasList, setPreguntasList] = useState<any>([]);

  useEffect(() => {
    if (id) {
      setUrl(`${urlDefault}/partida/${id}/jugador`);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    setPreguntasList(getPreguntas());

    const handleUpdate = (playersList: any) => {
      setPlayers(playersList);
    };

    socket.on("playersInRoom", handleUpdate);

    const handleIsStartGame = (isStart: any) => {
      if (isStart) {
        navigate(`/sala/${id}`);
      }
    };

    socket.on("isStartGame", handleIsStartGame);

    return () => {
      socket.off("playersInRoom", handleUpdate);
      socket.off("isStartGame", handleIsStartGame);
    };
  }, []);

  useEffect(() => {
    if (isSave && id && jugador) {
      socket.emit("register", { id, jugador });
    }
  }, [id, jugador]);

  useEffect(() => {
    if (
      typePlayer === "host" &&
      preguntasList.length > 0 &&
      players.length > 0
    ) {
      const preguntasListRandom = preguntasList.map((question: any) => {
        const nameRandom = getNameRandom(players);
        if (question.includes("%jugador%")) {
          return {
            question: question.replace("%jugador%", nameRandom),
            type: "RESPUESTA",
          };
        }
        return { question: question, type: "QUIEN_SERIA" };
      });
      socket.emit("questionsList", { partida: id, list: preguntasListRandom });
      dispatch(addQuestions(preguntasListRandom));
    }
  }, [preguntasList, players]);

  const empezarPartida = () => {
    if (id) {
      const nameRandom = getNameRandom(players);
      socket.emit("startGame", { id: id, status: true });
      socket.emit("nameRandom", { id, nameRandom });
      socket.emit("setNumberQuestion", { id, nPreguntas });
    }
  };

  const copyUrl = async () => {
    console.log("asd");
    await navigator.clipboard.writeText(url);
    setCopiado(true);
  };

  console.log("copiado", copiado);

  return (
    <div className="pt-48 md:pt-0 md:h-dvh bg-gradient-to-tr from-pink-500 to-yellow-500 flex justify-center items-center flex-col">
      <div
        className={`w-5/6 md:flex md:flex-row ${
          typePlayer === "host" ? "md:w-7/12" : "md:w-5/12"
        } `}
      >
        <div
          className={`md:mx-0 ${
            typePlayer === "host" ? "md:w-1/3" : "md:w-1/2"
          }`}
        >
          <RegisterPlayer
            partidaId={id || ""}
            onChangePlayer={setJugador}
            onSave={setIsSave}
          />
        </div>
        {typePlayer === "host" && (
          <>
            <div className="md:flex flex-col md:w-2/6 p-7 rounded-3xl ml-3 bg-white text-xl font-medium">
              <div className="flex items-center">
                <p className="mr-3">Nº preguntas</p>
                <select
                  onChange={(n) => setNPreguntas(Number(n.target.value))}
                  className="ring-2 ring-orange-600 rounded-md px-3 w-1/3 mt-2"
                  value={nPreguntas}
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                </select>
              </div>
              <div className="mt-3 relative">
                <div className="tooltip">
                  <div className="tooltip-content flex justify-end">
                    {copiado && (
                      <div className="animate-bounce text-white text-md font-black text-center w-36 bg-gradient-to-tr from-pink-500 to-yellow-500 p-1 rounded-md">
                        Copiado
                      </div>
                    )}
                  </div>
                  <Input
                    label="Comparte la URL a los demás"
                    value={url}
                    onClick={() => copyUrl()}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Button
                  color="secondary"
                  variant="shadow"
                  className="font-bold my-10 text-2xl p-7"
                  onClick={empezarPartida}
                >
                  EMPEZAR LA LOCURA
                </Button>
              </div>
            </div>
          </>
        )}
        <div
          className={`mt-3 md:mt-0 md:mx-0  ${
            typePlayer === "host" ? "md:w-1/3" : "md:w-1/2"
          }`}
        >
          <ListPlayers playersList={players} />
        </div>
      </div>
    </div>
  );
};
export default Home;
