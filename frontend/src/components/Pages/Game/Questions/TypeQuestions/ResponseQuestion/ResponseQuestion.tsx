import { Input } from "@nextui-org/react";
import {  useEffect, useState } from "react";

interface ResponseQuestionProps {
  question: string;
  onChooseResp: (e: string) => void;
}
const ResponseQuestion = (props: ResponseQuestionProps) => {
  const { question, onChooseResp } = props;
  
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    if(response){
      onChooseResp(response);
    }
  }, [response]);
  
  return (
    <div className="w-full">
      {question && (
        <>
        <h3 className="text-white font-bold text-3xl text-center my-10">
          {question}
        </h3>
        <div className="flex gap-3 w-full p-3">
          <Input
            type="text"
            id={"quien"}
            value={response}
            placeholder="Cuidado con lo que dices..."
            classNames={{
              label: "text-black/10 text-2xl",
              input: [
                "w-full",
                "bg-transparent",
                "text-black/40 text-1xl",
                "placeholder:text-default-700/50  text-1xl",
              ],
            }}
            onChange={(resp) => {
              setResponse(resp.target.value);
            }}
          />
          {/* <button className="bg-purple-500 text-white p-2 rounded-md" onClick={() => onChooseResp(response)}>Enviar</button> */}
        </div>
        </>
      )}
    </div>
  );
};

export default ResponseQuestion;
