import { Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom";
import { generarID } from "../../Utils";


const NewGame = () => {
  const navigate = useNavigate();
  const idPartida = generarID();
  

  const createGame = () =>{
    navigate(`/partida/${idPartida}`)
  }
  return (
    <div className="h-dvh bg-gradient-to-tr from-pink-500 to-yellow-500 flex justify-center items-center flex-col">
      <Button color="secondary" variant="shadow" className="font-bold" onClick={createGame}>
          CREAR PARTIDA
      </Button>
    </div>
  )
}

export default NewGame
