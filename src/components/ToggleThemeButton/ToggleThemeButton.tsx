import { FC } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./ToggleThemeButton.module.css";

interface ToggleThemeButtonProps {
  theme: string | boolean; //0 - dark, 1 - light
  setTheme?: () => void;
}

export const ToggleThemeButton: FC<ToggleThemeButtonProps> = ({
  setTheme,
  theme,
}) => {
  const { button, check, moon, sun, circle, div } = styles;
  const handleClick = () => {
    setTheme && setTheme();
    const circ = document.querySelector(`.${styles.circle}`) as HTMLElement;
    
    circ.style.translate = circ.style.translate === "-100%" ? '0px' : "-100%"; 

  };
  return (
    <label htmlFor={check} className={` ${button}`}>
      <input type="checkbox" onClick={handleClick} id={check} />
      <FaSun className={sun} />
      <FaMoon color="white" className={moon} />
      <span className={`${circle} `} />
    </label>
  );
};
