import { Avatar } from "@nextui-org/react";
import { useRef, useState } from "react";
import monster1 from "../../../assets/players/monster_amarillo.png";
import monster2 from "../../../assets/players/monster_azul.png";
import monster3 from "../../../assets/players/monster_morado.png";
import monster4 from "../../../assets/players/monster_naranja.png";
import monster5 from "../../../assets/players/monster_negro.png";
import monster6 from "../../../assets/players/monster_rosa.png";
import monster7 from "../../../assets/players/monster_rojo.png";
import monster8 from "../../../assets/players/monster_verde.png";

interface Avatars {
  chooseAvatar: (monster: string) => void;
}
export const Avatars = (props: Avatars) => {
  const { chooseAvatar } = props;
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef(null);
  const monsters = [
    monster1,
    monster2,
    monster3,
    monster4,
    monster5,
    monster6,
    monster7,
    monster8,
  ];

  const chooseAv = (avatar: string) => {
    chooseAvatar(avatar);
    setShowPopup(!showPopup);
  };
  return (
    <div className="relative flex justify-end ">
      <button
        ref={buttonRef}
        onClick={() => setShowPopup(!showPopup)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Monster
      </button>

      {showPopup && (
        <div className="absolute bottom-full mb-2 bg-white border rounded shadow-lg p-4 w-80 z-10 flex gap-3 flex-wrap justify-start items-start">
          {monsters.map((monster, i) => {
            return (
              <Avatar
                key={i}
                isBordered
                color="secondary"
                src={monster}
                className="w-12 h-12 text-large m-auto mb-5"
                onClick={() => chooseAv(monster)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
