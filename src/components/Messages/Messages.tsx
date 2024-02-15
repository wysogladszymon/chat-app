import { FC, ReactNode, useState } from "react";
import { LuSend } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";
import styles from "./Messages.module.css";
interface MessagesProps {
  children?: ReactNode;
}

export const Messages: FC<MessagesProps> = ({ children }) => {
  const [clicked, setClicked] = useState<boolean>(false);
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      <div className="flex border-b p-5 items-center">
        <div
          className={`${styles.logo} ${clicked ? styles.active : ""}`}
          style={{ display: "none" }}
          onClick={() => setClicked(!clicked)}
        >
          <span className="bg-gray-400"></span>
          <span className="bg-gray-400"></span>
          <span className="bg-gray-400"></span>
        </div>
        <h1 className="text-2xl text-gray-700 ml-20"> Chat Name</h1>
      </div>
      <div className="grow flex flex-col justify-end">{children}</div>
      <div className="flex max-h-32 p-5 border items-center justify-center">
        <div className="w-10 mr-5">
          <label className={`${styles.changePhoto}`} htmlFor={styles.fileinput}>
            <GoFileMedia size={"40px"} className="cursor-pointer p-2 " />
          </label>
          <input
            type="file"
            id={styles.fileinput}
            style={{ display: "none" }}
            accept="image/jpeg, image/png, image/jpg"
          />
        </div>
        <textarea
          className="h-full outline-none p-5 grow rounded-2xl text-wrap"
          placeholder="write a message..."
        />
        <button className="h-10 w-10 mr-5 ml-5">
          <LuSend
            size={"40px"}
            className="cursor-pointer border p-2 bg-gray-200 rounded-full"
          />
        </button>
      </div>
    </div>
  );
};
