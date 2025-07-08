interface Winnerprops {
  player: any;
}
const Winner = (props: Winnerprops) => {
  const { player } = props;
  return (
    <div className="mb-10">
      <h2 className="text-white font-bold text-3xl text-center ">
        Y EL GANADOR ES
      </h2>
      <h3 className="text-white font-bold text-5xl text-center ">
        {player.nombre}
      </h3>
    </div>
  );
};

export default Winner;
