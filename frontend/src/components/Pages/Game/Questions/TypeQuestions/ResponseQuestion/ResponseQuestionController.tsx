import { useEffect, useState } from "react";
import { ResponseQuestionProps } from "./ResponseQuestion";

export const ResponseQuestionController = (props: ResponseQuestionProps) => {
  const { question, onChooseResp } = props;

  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    if (response) {
      onChooseResp(response);
    }
  }, [response]);
  return {
    question,
    response,
    setResponse,
  };
};
