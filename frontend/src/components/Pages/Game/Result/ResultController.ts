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
    const [lastResp, setLastResp] = useState<string>('');
    const [numberQuestion, setNumberQuestion] = useState<number>(0);
    const [playersResp, setPlayersResp] = useState<any>([]);
    const hasExecuted = useRef(false);

    useEffect(() =>{
        if(win){
            hasExecuted.current = true;
        }
    },[win])

    useEffect(() => {
            socket.emit("getLastResp", { partida });

            const getResult = ({ result, count }: { result: any; count: number }) => {
                setNumberQuestion(count);
                setResultList(result);
              };

            const getLastResp = (resp: any) => {
                setLastResp(resp);
            };

            socket.on("allPlayersAnswered", getResult);
            socket.on("getLastResp", getLastResp);
            return () => {
                socket.off("allPlayersAnswered", getResult);
                socket.off("getLastResp", getLastResp);
                
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
        if(mostRepeatedName.conteo > 0){
            console.log('lastResp', lastResp)

            if(lastResp === mostRepeatedName.respuesta  && !hasExecuted.current){
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
