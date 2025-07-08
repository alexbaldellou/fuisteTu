import { useEffect, useState } from "react";
// import { JugadorInterface } from "../../../../../../Interface/JugadorInterface";
// import { playersService } from "../../../../../../services/allService";

// interface ResponseChooseQuestionProps {
//   partida: string | undefined;
// }
const ResponseChooseQuestion = () => {
  // const { partida } = props;
  const [responseList, setResponseList] = useState<any>();

  useEffect(() => {
    getListResp();
  }, []);

  const getListResp = async () => {
    // const allPlayersS = await playersService.getListPlayers();
    // const allPlayers: JugadorInterface[] = allPlayersS.docs
    //   .map((doc) => doc.data())
    //   .filter((data) => data.partida == partida) as JugadorInterface[];
    const allPlayers: any = [];
    const allResponse = allPlayers.map((player: any) => {
      return player.respuesta;
    });
    setResponseList(allResponse);
  };
  return (
    responseList &&
    responseList.map((r: any) => {
      return <p>{r}</p>;
    })
  );
};

export default ResponseChooseQuestion;
