import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ResponseQuestionProps {
  question: string;
  nameRandom: string;
  onChooseResp: (e: string) => void;
}
const ResponseQuestion = (props: ResponseQuestionProps) => {
  const { question, onChooseResp, nameRandom } = props;
  const [response, setResponse] = useState<string>("");
  const [resp, setResp] = useState<string>("");
  const typeUser = localStorage.getItem("typeUser");

  useEffect(() => {
    if (nameRandom) {
      setResp(question.replace("%jugador%", nameRandom));
    }
  }, [nameRandom]);

  return (
    <div>
      <h3 className="text-white font-bold text-3xl text-center my-10">
        {resp}
      </h3>
      {typeUser === "player" && (
        <div className="w-9/12 m-auto">
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
              setResponse(resp.target.value), onChooseResp(resp.target.value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ResponseQuestion;
