import { Avatar, Input } from "@nextui-org/react";
import { JugadorInterface } from "../../../Interface/JugadorInterface";
import { generarID } from "../../Utils";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/userSlice";
import { Avatars } from "./Avatars";

interface LoginPlayerInter {
  onChangePlayer?: (pl: JugadorInterface) => void;
  partidaId?: string;
  onSave: (isSave: boolean) => void;
}
export const RegisterPlayer = (props: LoginPlayerInter) => {
  const dispatch = useDispatch();
  const id = generarID();
  const { partidaId, onChangePlayer, onSave } = props;
  const [jugador, setJugador] = useState<JugadorInterface>(
    {} as JugadorInterface
  );
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [nombreJugador, setNombreJugador] = useState<string>("");
  const [avatar, setAvatar] = useState<any>();

  useEffect(() => {
    if (jugador.nombre) {
      dispatch(addUser(jugador));
      localStorage.setItem("id", jugador.id);
      localStorage.setItem("typeUser", "player");
      if (onChangePlayer) {
        onChangePlayer(jugador);
      }
    }
  }, [jugador]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    saveJugador();
  };

  const saveJugador = async () => {
    const infoJugador = {
      id: id,
      nombre: nombreJugador,
      url: avatar,
      partida: partidaId,
      puntos: 0,
    } as JugadorInterface;

    setJugador(infoJugador);
  };

  const readyPlayer = () => {
    onSave(true);
    setHideButton(true);
  };
  return (
    <form className=" h-full bg-white p-7 rounded-3xl" onSubmit={handleSubmit}>
      <Avatars chooseAvatar={setAvatar} />
      <Avatar
        isBordered
        src={avatar}
        className="w-40 h-40 text-large m-auto mb-5 bg-violet-400"
      />
      <Input
        type="text"
        id={"jugador"}
        label="Quién eres"
        placeholder="Escribe tu nombre"
        className="mb-3"
        readOnly={hideButton}
        value={nombreJugador}
        onChange={(e) => setNombreJugador(e.target.value)}
      />
      <Input
        key={"primary"}
        type="submit"
        value={"Estoy preparado"}
        color={"primary"}
        hidden={hideButton}
        onClick={readyPlayer}
        classNames={{
          input: ["text-white", "font-bold", "text-2xl"],
          inputWrapper: [
            !hideButton
              ? "bg-gradient-to-tr from-pink-500 to-yellow-500"
              : "hidden",
          ],
        }}
      />
    </form>
  );
};
