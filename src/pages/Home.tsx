import { FC, ReactNode } from "react";
import { useThemeContext } from "../store/ThemeContext";
import { ToggleThemeButton, Logout, ChatApp } from "../components";
import { useAuthContext } from "../store/AuthContext";
interface HomeProps {
  children?: ReactNode;
}

export const Home: FC<HomeProps> = ({ children }) => {
  const { theme } = useThemeContext();
  const { currentUser } = useAuthContext();
  return <><ChatApp/></>;
};
