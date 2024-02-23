import { FC } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { IoIosLogOut } from "react-icons/io";
import { useThemeContext } from "../../store/ThemeContext";

interface LogoutProps {
}

export const Logout: FC<LogoutProps> = () => {
  const { setCurrentUser } = useAuthContext();

  const handleClick = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };
  const {theme} = useThemeContext();
  return (
    <IoIosLogOut onClick={handleClick}
      size={"100%"}
      className={`${theme ? ' text-gray-200' : ' text-gray-500'} cursor-pointer hover:border-indigo-600 hover:text-indigo-600 flex shrink-0 items-center justify-center rounded-lg border text-[0.625rem] transition-all duration-300`}
    />
  );
};
