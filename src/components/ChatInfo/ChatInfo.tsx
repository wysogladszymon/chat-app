import { FC } from "react";
import styles from "./ChatInfo.module.css";
import pic from "../../assets/defaultPicture.png"
import { useThemeContext } from "../../store/ThemeContext";

interface ChatInfoProps {
  date: string;
  name: string;
  lastmsg: string;
  picURL: string;
  onClick: () => void;
  my: boolean,
  className?: string
}

export const ChatInfo: FC<ChatInfoProps> = ({
  date,
  lastmsg,
  name,
  picURL,
  onClick,
  className,
  my
}) => {
  picURL = picURL || pic;
  console.log();
  const {theme} = useThemeContext();
  return (
    <div
      className={`${className || ''} ${theme ? 'hoverDarkColor' : 'hoverLightColor'} w-full p-5 flex items-center gap-5 cursor-pointer`}
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
      <div className="grow overflow-hidden">
        <h1 className="font-medium text-xl">{name}</h1>
        <div className='flex'>
        {my && <p className={`${theme ? 'text-gray-200' : 'text-gray-500'} text-xs mr-1`}>You: </p>}
        <p className={`${theme ? 'text-gray-200' : 'text-gray-500'} h-5 overflow-hidden text-xs max-w-[277px]`}>{lastmsg}</p>
        </div>
      </div>
      <p className={`${theme ? 'text-gray-200' : 'text-gray-500'} text-xs flex flex-col items-center`}>
        <span>{date && date.split(" ")[1]}</span>
        <span>{date && date.split(" ")[0]}</span>
      </p>
    </div>
  );
};
