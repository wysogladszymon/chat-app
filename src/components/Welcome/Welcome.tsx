import { FC, ReactNode } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import styles from './Welcome.module.css';
interface WelcomeProps {
  children?: ReactNode;
}

export const Welcome: FC<WelcomeProps> = ({ children }) => {
  return (
    <div className="self-center mt-52 text-6xl flex items-center flex-col gap-10">
      <h1>Welcome in our Chat App</h1>
      <FaRegSmileBeam size={"300px"} className={styles.customSpin}/>
    </div>
  );
};
