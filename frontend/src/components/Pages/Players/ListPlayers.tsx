import { Avatar } from "@nextui-org/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addPlayers } from "../../../redux/playersSlice";

interface ListPlayersProps {
  partida?: string;
  playersList?: any;
}
const ListPlayers = (props: ListPlayersProps) => {
  const { playersList } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if(playersList && playersList.length > 0) {
      dispatch(addPlayers(playersList));
    }
  }, [playersList])

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
