import CardPlayer from "../../../../commons/CardPlayer";

interface WhoIsQuestionProps {
  question: string;
  playerList: any;
  onChoosePlayer: (player: string) => void;
}

const WhoIsQuestion = (props: WhoIsQuestionProps) => {
  const { question, playerList, onChoosePlayer } = props;
  console.log("question who", question);
  return (
    <div key={Math.random()}>
      <h3 className="text-white font-bold text-3xl text-center my-10 mx-5">
        {question}
      </h3>
      <div className="flex gap-9 flex-wrap w-full">
        {playerList.map((player: any) => {
          return (
            <>
              <CardPlayer player={player} click={onChoosePlayer} />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default WhoIsQuestion;
