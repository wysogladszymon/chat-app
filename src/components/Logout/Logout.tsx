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
    <button
      className={`flex relative border-2 border-solid `}
      onClick={handleClick}
    >
      <IoIosLogOut
        className={`absolute top-[50%] translate-y-[-50%] left-0 `}
      />
      <p className={` pr-10 pl-10`}>Logout</p>
    </button>
  );
};
