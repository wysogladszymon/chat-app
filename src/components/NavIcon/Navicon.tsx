import { FC, ReactNode, useState } from "react";
import styles from "./Navicon.module.css";

interface NavIconProps {
  children?: ReactNode;
}

export const NavIcon: FC<NavIconProps> = ({ children }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div
      className={`${styles.logo} ${clicked ? styles.active : ""}`}
      style={{ display: "none" }}
      onClick={() => setClicked(!clicked)}
    >
      <span className="bg-gray-400"></span>
      <span className="bg-gray-400"></span>
      <span className="bg-gray-400"></span>
    </div>
  );
};
