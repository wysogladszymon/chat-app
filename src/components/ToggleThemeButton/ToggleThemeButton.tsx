import { FC } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./ToggleThemeButton.module.css";
import { useThemeContext } from "../../store/ThemeContext";

interface ToggleThemeButtonProps {
}

export const ToggleThemeButton: FC<ToggleThemeButtonProps> = ({
}) => {
  const {theme, switchTheme} = useThemeContext();

  const { button, check, moon, sun, circle} = styles;

  const handleClick = () => {
    switchTheme();
    const circ = document.querySelector(`.${styles.circle}`) as HTMLElement;
    
    circ.style.translate = circ.style.translate === "-100%" ? '0px' : "-100%"; 
    circ.style.backgroundColor = theme ? '#94a3b8' : 'white';
  };
  return (
    <label htmlFor={check} className={` ${button}`}>
      <input type="checkbox" onClick={handleClick} id={check} />
      <FaSun className={sun} />
      <FaMoon color="white" className={moon} />
      <span className={`${circle} `}  style={{translate: !theme ? '100%': '0px'}}/>
    </label>
  );
};
