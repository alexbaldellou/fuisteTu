import { JugadorInterface } from "../../../Interface/JugadorInterface";
import { RegisterPlayer } from "./RegisterPlayer";

interface LoginPlayerInter {
  onChangePlayer?: (pl: JugadorInterface) => void;
}
const LoginPlayer = (props: LoginPlayerInter) => {
  const { onChangePlayer } = props;
  const oleborrar = (si: boolean) => {
    console.log(si);
  };

  return (
    <div className="w-full flex justify-center items-center flex-col h-dvh bg-gradient-to-tr from-pink-500 to-yellow-500">
      <RegisterPlayer onChangePlayer={onChangePlayer} onSave={oleborrar} />
    </div>
  );
};

export default LoginPlayer;
