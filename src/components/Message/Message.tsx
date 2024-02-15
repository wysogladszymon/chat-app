import { FC, ReactNode } from "react";
import styles from "./Message.module.css";

interface MessageProps {
  children?: ReactNode;
  my: boolean;
  date: Date;
}

export const Message: FC<MessageProps> = ({ children, my, date }) => {
  const clsColor = my ? "bg-blue-200" :  "bg-gray-300 ";
  const cls = my ? "ml-auto mr-16" : "ml-16 mr-auto";
  return (
    <div className={`${cls} mb-2 mt-2 max-w-[60%] relative min-w-[94px]`}>
      <p
        className={` p-4 rounded-lg mb-6 pl-6 pr-6 ${clsColor}`}
        style={{ wordWrap: "break-word" }}
      >
        {children}
      </p>
      <p className={`text-xs text-gray-500 text-wrap absolute bottom-0 p-0 ${my? "right-0" : 'left-0'} whitespace-nowrap`}>
        {date &&
          `${(0+ date.getHours().toString()).slice(-2)}:${(0+date.getMinutes().toString()).slice(-2)} ${(0 + date.getDate().toString()).slice(-2)}.${(
            0 + (date.getMonth() + 1).toString()
          ).slice(-2)}.${date.getFullYear().toString()}`}
      </p>
    </div>
  );
};
