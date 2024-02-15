import { FC, ReactNode } from "react";
import styles from "./Logout.module.css";
import { useAuthContext } from "../../store/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { IoIosLogOut } from "react-icons/io";

interface LogoutProps {
  children?: ReactNode;
}

export const Logout: FC<LogoutProps> = ({ children }) => {
  const { setCurrentUser } = useAuthContext();

  const handleClick = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };
  return (
    <IoIosLogOut onClick={handleClick}
      size={"100%"}
      className={` cursor-pointer text-gray-400 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 flex shrink-0 items-center justify-center rounded-lg border text-[0.625rem] transition-all duration-300`}
    />
  );
};
