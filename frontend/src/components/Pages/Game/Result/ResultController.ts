import { useEffect, useRef, useState } from "react";
import { valorMasRepetido } from "../../../Utils";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../../../utils/socket";

const ResultController = () => {

    const navigate = useNavigate();
    const { partida } = useParams();
    const [playerResp, setPlayerResp] = useState<any>();
    const [win, setWin] = useState<boolean>(false);
    const [nextQuestion, setNextQuestion] = useState<boolean>(false);
    const [resultList, setResultList] = useState<any>([]);
    // const [idQuestion, setIdQuestion] = useState<number>(0);
    // const [lastResp, setLastResp] = useState<string>('');
    const [idPlayer, setIdPlayer] = useState<string>('');
    const [numberQuestion, setNumberQuestion] = useState<number>(0);
    const [playersResp, setPlayersResp] = useState<any>([]);
    const hasExecuted = useRef(false);

    useEffect(() =>{
        if(win){
            hasExecuted.current = true;
        }
    },[win])

    useEffect(() => {

            const getResult = ({ result, count }: { result: any; count: number }) => {
                setNumberQuestion(count);
                setResultList(result);
              };

            const getIdPlayer = (resp: any) => {
                setIdPlayer(resp);
            };

            socket.on("allPlayersAnswered", getResult);
            socket.on("getIdPlayer", getIdPlayer);
            return () => {
                socket.off("allPlayersAnswered", getResult);
                socket.off("getIdPlayer", getIdPlayer);
                
            };
    }, []);

    useEffect(() =>{
        if(resultList.length > 0){
            console.log('resultList', resultList)
            const allResponse = resultList.map((player:any) => {
                const responsePlayer = {...player.respuestas, jugador: player.nombre, url: player.url}
                return responsePlayer;
            });
            setPlayersResp(allResponse)
            if(numberQuestion > 0){
                theWinnerIs(allResponse)
            }else{
                console.log('finish')
                setTimeout(() => {
                    navigate(`/final/${partida}`);
                }, 10000);
            }
            
        }
    }, [resultList, numberQuestion])

    useEffect(() => {
        if (nextQuestion) {
            setTimeout(() => {
                navigate(`/sala/${partida}`);
            }, 10000);
        }
    }, [nextQuestion]);

    const theWinnerIs = (result:any) =>{
        const mostRepeatedName = valorMasRepetido(result);
        const respPlayer = result.find((player:any) => player.id === idPlayer);
        if(mostRepeatedName.conteo > 0){
            console.log('respPlayer.respuestas.respuesta', respPlayer.respuestas.respuesta)

            if(respPlayer.respuestas.respuesta === mostRepeatedName.respuesta  && !hasExecuted.current){
                //mandar 100 puntos
                socket.emit("playerWinner", { partida });
                setWin(true);
            }
            
            console.log('next')
            updateNPreguntas()
            setNextQuestion(true);
            setPlayerResp(mostRepeatedName.respuesta)
        }
        socket.emit("saveLastResp", { partida, respuesta: {respuesta: ''} });
    
        
    }

    const updateNPreguntas = () => {
        const updateNPreguntas = numberQuestion - 1;

        socket.emit("setNumberQuestion", {
        id: partida,
        nPreguntas: updateNPreguntas,
        });
    };
    
    return {
        playerResp,
        playersResp,
        win
     } as const
}

export default ResultController
