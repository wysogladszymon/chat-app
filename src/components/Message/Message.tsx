import { FC, ReactNode } from "react";
// import styles from "./Message.module.css";

interface MessageProps {
  children?: ReactNode;
  my: boolean;
  date: string;
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
      <p className={`text-xs mt-1 text-gray-400 ${my ?"text-end" : "text-start"}`}>
        {date}
      </p>
    </div>
  );
};
