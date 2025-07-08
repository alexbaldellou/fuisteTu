import { useEffect, useState } from "react";
import { JugadorInterface } from "../../../../Interface/JugadorInterface";
import { playersService } from "../../../../services/allService";
import { valorMasRepetido } from "../../../Utils";
import { useNavigate, useParams } from "react-router-dom";


const ResultController = () => {

    const navigate = useNavigate();
    const user = localStorage.getItem("id") || "";
    const [infoJugador, setInfoJugador] = useState<any>({} as JugadorInterface);
    const { partida } = useParams();
    const [response, setResponse] = useState<any>("");
    const [playerResp, setPlayerResp] = useState<any>();
    const [win, setWin] = useState<boolean>(false);
    const [nextQuestion, setNextQuestion] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            getInfoPlayer();
        }
    }, []);

    useEffect(() => {
        if (response) {
            getPlayer(response);
        }
    }, [response]);

    useEffect(() => {
        if (nextQuestion) {
            setPointsToPlayers();
        }
    }, [nextQuestion]);

    const getInfoPlayer = async () => {
        const infoJugadorS = await playersService.getJugador(user);
        const infoJugador = infoJugadorS.data();
        setInfoJugador(infoJugador);
        getResponse();
    };

    const getResponse = async () => {
        // Comprobamos resultado de la partida
        // const allPlayersS = await playersService.getListPlayers();
        // const allPlayers: JugadorInterface[] = allPlayersS.docs
        // .map((doc) => doc.data())
        // .filter((data) => data.partida == partida) as JugadorInterface[];
        const allPlayers:any = []
        const allResponse = allPlayers.map((player:any) => {
            return player.respuesta;
        });

        const win = valorMasRepetido(allResponse);
        if (win) {
            setResponse(win);
        }
        setNextQuestion(true);
    };

    const getPlayer = async (py: string) => {
        // Recuperamos información del jugador
        const infoPlayer = await playersService.getJugador(py);
        const pl = infoPlayer.data();
        setPlayerResp(pl);
    };

    const setPointsToPlayers = () => {
        setPoints();
        setTimeout(() => {
            // navigate(`/locura/${partida}`);
            navigate(`/sala/${partida}`);
        }, 15000);
    };

    const setPoints = async () => {
        // añadimos puntos
        if (response === infoJugador.respuesta) {
            const newPoint = infoJugador.puntos + 100;
            const addPoint = { ...infoJugador, puntos: newPoint, respuesta: "" };
            setWin(true);
            await playersService.updateJugador(addPoint);
        }
    };

    
    return [
        playerResp,
        win
    ] as const
}

export default ResultController
