import { Avatar } from "@nextui-org/react";
import { JugadorInterface } from "../../Interface/JugadorInterface";
import { useEffect } from "react";

interface CardPlayerInterface {
  player: JugadorInterface;
  click?: (id: any) => void;
  playerSelected?: string;
  onChoosePlayer?: (player: string) => void;
}
const CardPlayer = (props: CardPlayerInterface) => {
  const { player, click, playerSelected, onChoosePlayer } = props;
  const isActive = playerSelected === player.nombre;

  useEffect(() => {
    if (playerSelected && onChoosePlayer) {
      onChoosePlayer(playerSelected);
    }
  }, [playerSelected]);

  return (
    <>
      <div
        className={`${
          isActive ? "bg-white/45 ring-purple-500" : ""
        } ring-4 flex items-center justify-between m-1 w-full bg-white/25 p-3 rounded-3xl focus:ring-purple-500 focus:ring-4 hover:ring-purple-500 hover:ring-4 mx-3`}
        key={player.id}
        onClick={() => click && click(player.nombre)}
      >
        <div className="flex items-center">
          <Avatar
            isBordered
            color="default"
            src={player.url}
            className="w-20 h-20 text-large mr-7"
          />
          <div>
            <h3 className="text-white font-bold text-xl">{player.nombre}</h3>
            <p className="text-white font-bold text-2xl">{player.puntos} PTS</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPlayer;
