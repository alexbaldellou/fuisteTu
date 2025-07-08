import { CircularProgress } from "@nextui-org/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JugadorInterface } from "../../../Interface/JugadorInterface";
import { gameService } from "../../../services/allService";

interface WaitPlayersProps {
  player: JugadorInterface;
  idPartida: string;
}
const WaitPlayers = (props: WaitPlayersProps) => {
  const navigate = useNavigate();
  const { player, idPartida } = props;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getStatus();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    getStatus();
  }, [idPartida]);

  const getStatus = async () => {
    const infoPartida = await gameService.getPartida(idPartida);
    const info = infoPartida.data() || {};
    if (info.status) {
      // navigate(`/locura/${idPartida}`);
      navigate(`/sala/${idPartida}`);
    }
  };
  return (
    <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
      <h2 className="text-white font-bold text-4xl mb-3 text-center">
        ¡No sabes donde te metiste!
      </h2>
      <h2 className="font-bold text-7xl mb-14 text-center uppercase  bg-gradient-to-tr from-pink-700 to-rose-500 bg-clip-text text-transparent">
        {player.nombre}
      </h2>
      <CircularProgress
        size="lg"
        strokeWidth={4}
        classNames={{
          svg: "w-36 h-36 drop-shadow-md",
          indicator: "stroke-white",
          track: "stroke-white/10",
        }}
        className="animate-bounce"
        showValueLabel={true}
      />
      <h3 className="text-white font-bold text-3xl">
        Esperando a los demás panas...
      </h3>
    </div>
  );
};

export default WaitPlayers;
