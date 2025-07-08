import { useEffect, useState } from "react";
import { JugadorInterface } from "../../../../../../Interface/JugadorInterface";
import { playersService } from "../../../../../../services/allService";

interface ResponseChooseQuestionProps {
  partida: string | undefined;
}
const ResponseChooseQuestion = (props: ResponseChooseQuestionProps) => {
  const { partida } = props;
  const [responseList, setResponseList] = useState<any>();

  useEffect(() => {
    getListResp();
  }, []);

  const getListResp = async () => {
    const allPlayersS = await playersService.getListPlayers();
    const allPlayers: JugadorInterface[] = allPlayersS.docs
      .map((doc) => doc.data())
      .filter((data) => data.partida == partida) as JugadorInterface[];

    const allResponse = allPlayers.map((player) => {
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
