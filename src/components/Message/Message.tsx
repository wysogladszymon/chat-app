import { FC, ReactNode } from "react";
// import styles from "./Message.module.css";

interface MessageProps {
  children?: ReactNode;
  my: boolean;
  date: Date | null;
}

export const Message: FC<MessageProps> = ({ children, my, date }) => {
  const clsColor = my ? "bg-blue-200" :  "bg-gray-300 ";
  const cls = my ? "ml-auto mr-16" : "ml-16 mr-auto";
  
  return (
    <div className={`${cls} mt-3 mb-3`}>
      <p
        className={` ${clsColor} rounded-lg p-3 pl-5 pr-5 w-full text-center`}
        style={{ wordWrap: "break-word" }}
      >
        {children}
      </p>
      <p className={`text-xs mt-1 text-gray-400`}>
        {date &&
          `${(0+ date.getHours().toString()).slice(-2)}:${(0+date.getMinutes().toString()).slice(-2)} ${(0 + date.getDate().toString()).slice(-2)}.${(
            0 + (date.getMonth() + 1).toString()
          ).slice(-2)}.${date.getFullYear().toString()}`}
      </p>
    </div>
  );
};
