import { FC, useState } from "react";
import styles from "./Navicon.module.css";

interface NavIconProps {
}

export const NavIcon: FC<NavIconProps> = () => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div
      className={`${styles.logo} ${clicked ? styles.active : ""}`}
      onClick={() => setClicked(!clicked)}
    >
      <span className="bg-gray-400"></span>
      <span className="bg-gray-400"></span>
      <span className="bg-gray-400"></span>
    </div>
  );
};
