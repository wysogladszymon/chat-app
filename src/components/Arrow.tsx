import { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useActiveContext } from "../store/ActiveContext";
import { useThemeContext } from "../store/ThemeContext";

interface ArrowProps {
  className?: string;
}

export const Arrow: FC<ArrowProps> = ({ className }) => {
  const { dispatchActive } = useActiveContext();
  const { theme } = useThemeContext();
  return (
    <IoIosArrowBack
      color={theme ? "white" : "black"}
      size={"40px"}
      className={`${className || ""} cursor-pointer arrow`}
      onClick={() => dispatchActive({ type: "OUT", payload: null })}
    />
  );
};
