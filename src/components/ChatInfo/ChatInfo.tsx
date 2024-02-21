import { FC } from "react";
import styles from "./ChatInfo.module.css";
import pic from "../../assets/defaultPicture.png"

interface ChatInfoProps {
  date: string;
  name: string;
  lastmsg: string;
  picURL: string;
  onClick: () => void;
  my: boolean
}

export const ChatInfo: FC<ChatInfoProps> = ({
  date,
  lastmsg,
  name,
  picURL,
  onClick,
  my
}) => {
  picURL = picURL || pic;
  console.log();
  return (
    <div
      className="w-full border p-5 flex items-center gap-5 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
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
        <div className='flex'>
        {my && <p className='mr-1 text-sm text-gray-500'>You: </p>}
        <p className="overflow-hidden text-sm max-w-[277px] text-gray-500">{lastmsg}</p>
        </div>
      </div>
      <p className="text-sm flex flex-col items-center text-gray-500">
        <span>{date && date.split(" ")[1]}</span>
        <span>{date && date.split(" ")[0]}</span>
      </p>
    </div>
  );
};
