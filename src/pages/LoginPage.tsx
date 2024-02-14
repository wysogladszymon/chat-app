import { FC } from "react";
import { Login } from "../components";
import { useThemeContext } from "../store/ThemeContext";
interface LoginPageProps {}

export const LoginPage: FC<LoginPageProps> = () => {
  const { theme } = useThemeContext();

  return (
    // <div style={{minWidth:'100vw'}}>
    <div className={` min-w-[100vw] min-h-[100vh] flex items-center justify-center ${theme ? 'bg-gray-900' : 'bg-blue-200' } `}>
      <div>
        <Login link={"/signup"} title="Chat App" theme={theme}></Login>
      </div>
    </div>
  );
};
