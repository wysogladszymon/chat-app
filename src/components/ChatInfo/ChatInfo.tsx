import { FC } from "react";
import styles from "./ChatInfo.module.css";

interface ChatInfoProps {
  date: Date | null;
  name: string;
  lastmsg: string;
  picURL: string;
  onClick: () => void;
}

export const ChatInfo: FC<ChatInfoProps> = ({
  date,
  lastmsg,
  name,
  picURL,
  onClick
}) => {
  return (
    <div className="w-full border p-5 flex items-center gap-5 cursor-pointer hover:bg-gray-100" onClick={onClick}>
      <div
        className={`${styles.profilePhoto}`}
        style={{
          backgroundImage: `url(${picURL})`,
        }}
      >
        {
          <img
            src={picURL}
            style={{ aspectRatio: "1 / 1", visibility: "hidden" }}
          />
        }
      </div>
      <div className="ml-5 grow overflow-hidden">
        <h1 className="font-medium text-xl">{name}</h1>
        <p className="overflow-hidden max-w-[277px]">{lastmsg}</p>
      </div>
      <p className="text-sm flex flex-col items-center text-gray-500">
        {date &&
          `${(0 + date.getDate().toString()).slice(-2)}.${(
            0 + (date.getMonth() + 1).toString()
          ).slice(-2)}.${date.getFullYear().toString()} \n ${(0 + date.getHours().toString()).slice(-2)}:${(
            0 + date.getMinutes().toString()
          ).slice(-2)}`.split('\n').map((line, index) => {
            return <span key={index}>{line}
            <br /></span>
          })}
      </p>
    </div>
  );
};
