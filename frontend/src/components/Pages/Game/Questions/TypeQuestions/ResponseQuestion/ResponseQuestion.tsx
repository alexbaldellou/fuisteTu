import { Input } from "@nextui-org/react";
import { ResponseQuestionController } from "./ResponseQuestionController";

export interface ResponseQuestionProps {
  question: string;
  onChooseResp: (e: string) => void;
}
const ResponseQuestion = (props: ResponseQuestionProps) => {
  const { question, response, setResponse } = ResponseQuestionController(props);
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
          </div>
        </>
      )}
    </div>
  );
};

export default ResponseQuestion;
