import { useEffect, useRef, useState } from "react";
import { valorMasRepetido } from "../../../Utils";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../../../utils/socket";
import { useSelector } from "react-redux";

const ResultController = () => {

    const navigate = useNavigate();
    const { partida } = useParams();
    const [playerResp, setPlayerResp] = useState<any>();
    const [win, setWin] = useState<boolean>(false);
    const [nextQuestion, setNextQuestion] = useState<boolean>(false);
    const [resultList, setResultList] = useState<any>([]);
    // const [idQuestion, setIdQuestion] = useState<number>(0);
    // const [lastResp, setLastResp] = useState<string>('');
    const [numberQuestion, setNumberQuestion] = useState<number>(0);
    const [playersResp, setPlayersResp] = useState<any>([]);
    const hasExecuted = useRef(false);
    const idPlayer = useSelector((state: any) => state.user);
    const preguntasList = useSelector((state: any) => state.questionsList.list);
    const typePlayer = useSelector((state: any) => state.user.tipo);
    const currentQuestionIndex = useSelector((state: any) => state.questionsList.currentIndex);

    useEffect(() =>{
        if(win){
            hasExecuted.current = true;
        }
    },[win])

    //TODO: revisar porque hay usuarios que no llegan a la respuesta
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const getResult = ({ result, count }: { result: any; count: number }) => {
            console.log('DEBUG: Evento allPlayersAnswered recibido', { result, count });
            setNumberQuestion(count);
            setResultList(result);
            clearTimeout(timeoutId);
        };
        socket.on("allPlayersAnswered", getResult);
        // Si en 2 segundos no se recibe el resultado, pedirlo manualmente
        timeoutId = setTimeout(() => {
            if (resultList.length === 0 && partida && preguntasList.length > 0) {
                console.log('preguntasList', preguntasList)
                const preguntaId = preguntasList[currentQuestionIndex] || 0;
                console.log('DEBUG preguntaId usado para getCurrentResult:', preguntaId);
                socket.emit('getCurrentResult', { partida, preguntaId });
            }
        }, 2000);
        return () => {
            socket.off("allPlayersAnswered", getResult);
            clearTimeout(timeoutId);
        };
    }, [preguntasList, typePlayer, currentQuestionIndex]);

    console.log('resultList', resultList);
    useEffect(() =>{
        if(resultList.length > 0){
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
        if (preguntasList.length > 0 && typePlayer === "host") {
          socket.emit("questionsList", { partida, list: preguntasList });
        }
      }, [preguntasList]);

    useEffect(() => {
        if (nextQuestion) {
            setTimeout(() => {
                navigate(`/sala/${partida}`);
            }, 10000);
        }
    }, [nextQuestion]);

    const theWinnerIs = (result:any) =>{
        const mostRepeatedName = valorMasRepetido(result);
        const respPlayer = result.find((player:any) => player.jugador === idPlayer.nombre);
        if(mostRepeatedName.conteo > 0){
            if(respPlayer.respuesta === mostRepeatedName.respuesta  && !hasExecuted.current){
                //mandar 100 puntos
                socket.emit("playerWinner", { partida });
                setWin(true);
            }
            
            console.log('next')
            updateNPreguntas()
            setNextQuestion(true);
            setPlayerResp(mostRepeatedName.respuesta)
        }else{
            setNextQuestion(true);
        }
        // socket.emit("saveLastResp", { partida, respuesta: {respuesta: ''} });
    
        
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
