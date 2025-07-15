import { useEffect, useRef, useState } from "react";
import { valorMasRepetido } from "../../../Utils";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../../../utils/socket";

const ResultController = () => {

    const navigate = useNavigate();
    const user = localStorage.getItem("id") || "";
    const { partida } = useParams();
    const [playerResp, setPlayerResp] = useState<any>();
    const [win, setWin] = useState<boolean>(false);
    const [nextQuestion, setNextQuestion] = useState<boolean>(false);
    const [resultList, setResultList] = useState<any>([]);
    const [idQuestion, setIdQuestion] = useState<number>(0);
    const [lastResp, setLastResp] = useState<string>('');
    const hasExecuted = useRef(false);

    useEffect(() => {
        if (user) {
            
            socket.emit("resultQuestion", { partida });
            socket.emit("questionChoosed", { partida });
            socket.emit("getLastResp", { partida });

            const getResult = (questions: any) => {
                setResultList(Object.values(questions));
            };

            const getQuestionChoosed = (id: any) => {
                setIdQuestion(id);
            };

            const getLastResp = (resp: any) => {
                setLastResp(resp);
            };
            socket.on("getResultQuestion", getResult);
            socket.on("getQuestionChoosed", getQuestionChoosed);
            socket.on("getLastResp", getLastResp);

            return () => {
                socket.off("getResultQuestion", getResult);
                socket.off("getLastResp", getLastResp);
            };
        }
    }, []);

    useEffect(() =>{
        if(resultList.length > 0){
            const allResponse = resultList.map((player:any) => {
                return player.respuestas;
            });
            const isUndefined = allResponse.some((item:any) => item === undefined);
          
            if(!isUndefined && lastResp){
                const resultByQuestionId = allResponse.filter((val:any) => val.preguntaId === idQuestion)
                theWinnerIs(resultByQuestionId)
            }
            
        }
    }, [resultList])

    useEffect(() => {
        if (nextQuestion) {
            setTimeout(() => {
                navigate(`/sala/${partida}`);
            }, 15000);
        }
    }, [nextQuestion]);

    const theWinnerIs = (result:any) =>{
        const mostRepeatedName = valorMasRepetido(result);
        hasExecuted.current = true;

        if(mostRepeatedName.conteo > 1){
            console.log(`ultima: ${lastResp}, resp: ${mostRepeatedName.respuesta}`)
            if(lastResp === mostRepeatedName.respuesta){
                //mandar 100 puntos
                socket.emit("playerWinner", { partida });
                setWin(true);
            }
            setPlayerResp(mostRepeatedName.respuesta)
            
        }
        //removelastresp
        socket.emit("saveLastResp", { partida, respuesta: {respuesta: ''} });
        console.log('next')
        setNextQuestion(true);
    }
    
    return [
        playerResp,
        win
    ] as const
}

export default ResultController
