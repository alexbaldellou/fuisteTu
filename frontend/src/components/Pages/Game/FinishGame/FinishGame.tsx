// import { useEffect, useState } from "react";
// import { playersService } from "../../../../services/allService";
// import { useParams } from "react-router-dom";
// import CardPlayer from "../../../commons/CardPlayer";
// import Winner from "./Winner";
// import { ordenarMayorMenor } from "../../../Utils";

const FinishGame = () => {
  // const [players, setPlayers] = useState<any>([]);
  // const [playerWin, setPlayerWin] = useState<any>({});
  // const { partida } = useParams();

  // useEffect(() => {
  //   getPlayers();
  // }, []);

  // const getPlayers = async () => {
  //   const playerList = (await playersService.getListPlayers()).docs.map((doc) =>
  //     doc.data()
  //   );
  //   getPlayerWin(playerList);
  //   const orderPlayers = ordenarMayorMenor(playerList, "puntos");
  //   setPlayers(orderPlayers.filter((data) => data.partida === partida));
  // };

  // const getPlayerWin = (list: any) => {
  //   let mayorPuntuacion = 0;
  //   let playerW = {};

  //   list.forEach((player: any) => {
  //     if (player.puntos > mayorPuntuacion) {
  //       playerW = player;
  //       mayorPuntuacion = player.puntos;
  //     }
  //   });
  //   setPlayerWin(playerW);
  // };

  return (
    <div className="w-full flex justify-center items-center flex-col py-14 md:h-dvh bg-gradient-to-tr from-pink-500 to-yellow-500">
      {/* <Winner player={playerWin} />
      <div className="md:w-5/12">
        {players &&
          players.map((player: any) => {
            return <CardPlayer player={player} />;
          })}
      </div> */}
      <p>finish</p>
    </div>
  );
};

export default FinishGame;
