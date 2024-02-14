import { FC, ReactNode } from "react";
import { Signup } from "../components";
import { useThemeContext } from "../store/ThemeContext";

interface SignupPageProps {
  children?: ReactNode;
}

export const SignupPage: FC<SignupPageProps> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    // <div style={{minWidth:'100vw'}}>
    <div className={` min-w-[100vw] min-h-[100vh] flex items-center justify-center ${theme ? 'bg-gray-900' : 'bg-blue-200' } `}>
      <div>
        <Signup link={"/login"} title="Chat App" theme={theme}></Signup>
      </div>
    </div>
  );
};