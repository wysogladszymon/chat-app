import { FC, ReactNode } from "react";
import { useThemeContext } from "../store/ThemeContext";
import { ToggleThemeButton, Logout } from "../components";
interface HomeProps {
  children?: ReactNode;
}

export const Home: FC<HomeProps> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <div
      className={`relative min-w-[100vw] min-h-[100vh] flex items-center justify-center flex-col ${
        theme ? "bg-gray-900" : "bg-blue-200"
      } `}
    >
      <div className="absolute top-10 right-10">
        <ToggleThemeButton />
      </div>
      <p>Congratz</p>
      <div>
        <Logout />
      </div>
    </div>
  );
};
