import ResultController from "./ResultController";

const Result = () => {
  const [playerResp, win] = ResultController();
  return (
    <div className="w-full flex justify-center items-center flex-col md:h-dvh py-14 bg-gradient-to-tr from-pink-500 to-yellow-500">
      {playerResp ? (
        <>
          <h1 className="text-white font-bold text-3xl text-center">
            Y el jugador que ha tenido más votos es
          </h1>
          <h1 className="font-bold text-5xl my-8 text-center uppercase  bg-gradient-to-tr from-pink-700 to-rose-500 bg-clip-text text-transparent animate-appearance-in">
            {playerResp.nombre}
          </h1>
          {win && (
            <div className="flex items-center justify-center animate-ping-2  bg-[url('../../../../public/Game/win.png')] bg-no-repeat bg-cover bg-center w-48 h-48">
              <p className="text-white font-bold text-4xl animate-bounce z-10">
                100 PTS
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-white font-bold text-3xl text-center">
            No hubo jugador más votado, se nota que os queréis mucho
          </h1>
        </>
      )}
    </div>
  );
};

export default Result;
