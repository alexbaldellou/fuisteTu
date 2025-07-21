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
    const hasExecuted = useRef(false);

    useEffect(() =>{
        if(win){
            hasExecuted.current = true;
        }
    },[win])

    useEffect(() => {
            socket.emit("resultQuestion", { partida });
            socket.emit("questionChoosed", { partida });
            socket.emit("getLastResp", { partida });
            socket.emit("getNQuestion", { partida });

            const getResult = (questions: any) => {
                setResultList(questions);
            };

            // const getQuestionChoosed = (id: any) => {
            //     setIdQuestion(id);
            // };

            const getLastResp = (resp: any) => {
                setLastResp(resp);
            };

            const getNumberQuestion = (count: any) => {
                setNumberQuestion(count);
            };

            socket.on("getResultQuestion", getResult);
            // socket.on("getQuestionChoosed", getQuestionChoosed);
            socket.on("getLastResp", getLastResp);
            socket.on("getNumberQuestion", getNumberQuestion);
            

            return () => {
                socket.off("getResultQuestion", getResult);
                // socket.off("getQuestionChoosed", getQuestionChoosed);
                socket.off("getLastResp", getLastResp);
                socket.off("getNumberQuestion", getNumberQuestion);
            };
    }, []);

    useEffect(() =>{
        if(resultList.length > 0){
            const allResponse = resultList.map((player:any) => {
                return player.respuestas;
            });
            // const isUndefined = allResponse.some((item:any) => item === undefined);
            console.log('allResponse', allResponse)
            // if(!isUndefined && lastResp){ //asdasdasd
                
            //     const resultByQuestionId = allResponse.filter((val:any) => val.preguntaId === idQuestion)
                theWinnerIs(allResponse)
            // }
            
        }
    }, [resultList])

    useEffect(() => {
        if (nextQuestion) {
            setTimeout(() => {
                navigate(`/sala/${partida}`);
            }, 10000);
        }
    }, [nextQuestion]);

    const theWinnerIs = (result:any) =>{
        const mostRepeatedName = valorMasRepetido(result);
        
        if(mostRepeatedName.conteo > 1){
            if(lastResp === mostRepeatedName.respuesta  && !hasExecuted.current){
                //mandar 100 puntos
                socket.emit("playerWinner", { partida });
                setWin(true);
            }
            setPlayerResp(mostRepeatedName.respuesta)
            
        }
        socket.emit("saveLastResp", { partida, respuesta: {respuesta: ''} });
        
        if(numberQuestion > 0){//TODO: COMPROBAR RESULTADO ANTES DE MANDAR A FINAL
            console.log('next')
            updateNPreguntas()
            setNextQuestion(true);
        }else{
            console.log('finish')
            setTimeout(() => {
                 navigate(`/final/${partida}`);
            }, 10000);
        }
    }

    const updateNPreguntas = () => {
        const updateNPreguntas = numberQuestion - 1;

        socket.emit("setNumberQuestion", {
        id: partida,
        nPreguntas: updateNPreguntas,
        });
  };
    
    return [
        playerResp,
        win
    ] as const
}

export default ResultController
