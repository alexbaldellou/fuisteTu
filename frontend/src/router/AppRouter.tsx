import { Route, Routes } from "react-router-dom";
import Home from "../components/Pages/Home/Home";
import NewGame from "../components/Pages/Game/NewGame";
import Result from "../components/Pages/Game/Result/Result";
import Room from "../components/Pages/Game/Room";
import FinishGame from "../components/Pages/Game/FinishGame/FinishGame";
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/partida/:id/:typePlayer" element={<Home />} />
      <Route path="/sala/:partida/" element={<Room />} />
      <Route path="/resultado/:partida" element={<Result />} />
      <Route path="/final/:partida" element={<FinishGame />} />
      <Route path="/*" element={<NewGame />} />
    </Routes>
  );
};

export default AppRouter;
