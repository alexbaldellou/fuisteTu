
interface ListResultProps {
    list: any[]
}
const ListResult = (props: ListResultProps) => {
    const { list } = props;
  return (
  <>
  <div className="text-2xl font-bold text-center text-white my-4">Quién votó a quién:</div>
  <div className="flex gap-4">
    {list.map((item, index) => (
        <div key={index} className="flex flex-col rounded-lg bg-white p-4 shadow-lg w-48 text-center">
            <div className="flex flex-col gap-2">
                <img src={item.url} alt={item.jugador} className="w-full h-full" />
                <div className="text-xl font-bold">{item.jugador} </div>
            </div>
            <div className="text-sm"><span className="text-sm">votó a: {item.respuesta}</span></div>
        </div>
    ))}
  </div>
    
  </>
    
  )
}

export default ListResult