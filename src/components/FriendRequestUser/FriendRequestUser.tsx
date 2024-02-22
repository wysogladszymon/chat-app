import { FC } from "react";
import styles from "./FriendRequestUser.module.css";
import pic from "../../assets/defaultPicture.png";
import { TiTick } from "react-icons/ti";
import { useThemeContext } from "../../store/ThemeContext";

interface FriendRequestUserProps {
  displayName: string;
  email: string;
  photoURL: string | null;
  decline: () => void;
  accept: () => void;
}

export const FriendRequestUser: FC<FriendRequestUserProps> = ({
  displayName,
  email,
  photoURL,
  decline,
  accept,
}) => {
  if (!photoURL) photoURL = pic;
  const {theme} = useThemeContext();
  return (
    <div className={` p-5 max-w-[600px] flex items-center gap-5 ${!theme ? 'text-gray-500 border-2 border-gray-200' : 'text-gray-200 border-2 border-gray-500'}  border-gray-300 rounded-3xl`}>
      <div
        className={`${styles.profilePhoto}`}
        style={{
          backgroundImage: `url(${photoURL})`,
        }}
      >
        {
          <img
            src={photoURL}
            style={{ aspectRatio: "1 / 1", visibility: "hidden" }}
          />
        }
      </div>
      <div className="ml-5 grow overflow-hidden flex-col flex">
        <h1 className="font-medium text-xl">{displayName}</h1>
        <p className={`${theme ? 'text-gray-200' : 'text-gray-500'}`}>{email}</p>
      </div>
      <div className="flex gap-2">
        <TiTick
        color={'black'}
          onClick={accept}
          size={"30px"}
          className={`cursor-pointer bg-green-500 p-[2px] rounded-full `}
        ></TiTick>
        <button
          onClick={decline}
          className="w-[30px] h-[30px] bg-red-500 relative rounded-full"
        >
          <div className="absolute h-[3px] w-4 bg-black rounded-xl rotate-45 origin-center top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute h-[3px] w-4 bg-black rounded-xl -rotate-45 origin-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {""}{" "}
          </div>
        </button>
      </div>
    </div>
  );
};
