import { FC, ReactNode, useState } from "react";
import styles from "./AddFriendUser.module.css";
import pic from "../../assets/defaultPicture.png";

interface AddFriendUserProps {
  displayName: string;
  children?: ReactNode;
  email: string;
  photoURL: string | null;
  onClick: () => void;
  initial: boolean
}

export const AddFriendUser: FC<AddFriendUserProps> = ({
  children,
  displayName,
  email,
  photoURL,
  onClick,
  initial
}) => {
  const [clicked, setClicked] = useState<boolean>(initial);
  if (!photoURL) photoURL = pic;

  const handleClick = async() => {
    await onClick();
    setClicked(true);
  }
  return (
    <div className="w-full p-5 flex items-center gap-5 border-solid border-2 border-gray-300 rounded-3xl">
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
        <p className={`text-gray-400`}>{email}</p>
      </div>
      {
        clicked ? <p className="mr-20 border-2 p-3 rounded-md ml-6 ">
          request sent
        </p>:
        <button
          className="mr-20 border-2 p-3 rounded-md hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 ml-6 "
          onClick={handleClick}
        >
          Add friend
        </button>
      }
    </div>
  );
};
