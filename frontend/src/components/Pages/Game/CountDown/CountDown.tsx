import { Card, CardBody, CircularProgress } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

interface CountDownProps {
  seconds: number;
  onTimeOut: (status: boolean) => void;
}
const CountDown = (props: CountDownProps) => {
  const { seconds, onTimeOut } = props;
  const [count, setCount] = useState<number>(seconds);
  const time = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    time.current = setInterval(() => {
      setCount((seg) => seg - 1);
    }, 1000);
    return () => clearInterval(time.current);
  }, []);

  useEffect(() => {
    if (count <= 0) {
      clearInterval(time.current);
      onTimeOut(true);
    }
  }, [count]);

  return (
    <div>
      <Card
        className="w-[240px] h-[240px] shadow-none bg-transparent"
        aria-label="Iniciar temporizador"
      >
        <CardBody
          className="justify-center items-center pb-0"
          aria-label="Iniciar temporizador"
        >
          <CircularProgress
            aria-label="Iniciar temporizador"
            classNames={{
              svg: "w-40 h-40 drop-shadow-md",
              indicator: "stroke-white",
              track: "stroke-white/10",
              value: "text-6xl font-semibold text-white",
            }}
            className="animate-pulse duration-75"
            formatOptions={{ style: "decimal" }}
            value={count}
            valueLabel={count}
            minValue={0}
            maxValue={seconds}
            strokeWidth={5}
            showValueLabel={true}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CountDown;
