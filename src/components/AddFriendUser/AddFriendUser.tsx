import { FC, useState } from "react";
import styles from "./AddFriendUser.module.css";
import pic from "../../assets/defaultPicture.png";
import { useThemeContext } from "../../store/ThemeContext";

interface AddFriendUserProps {
  displayName: string;
  email: string;
  photoURL: string | null;
  onClick: () => void;
  initial: boolean;
}

export const AddFriendUser: FC<AddFriendUserProps> = ({
  displayName,
  email,
  photoURL,
  onClick,
  initial,
}) => {
  const [clicked, setClicked] = useState<boolean>(initial);
  if (!photoURL) photoURL = pic;
  const { theme } = useThemeContext();
  const handleClick = async () => {
    await onClick();
    setClicked(true);
  };
  return (
    <div
      className={` p-5 max-w-[600px] flex items-center gap-5 ${
        !theme
          ? "text-gray-500 border-2 border-gray-200"
          : "text-gray-200 border-2 border-gray-500"
      }  border-gray-300 rounded-3xl`}
    >
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
      <div className="grow overflow-hidden flex-col flex">
        <h1 className="font-medium text-xl">{displayName}</h1>
        <p className={`${theme ? "text-gray-200" : "text-gray-500"}`}>
          {email}
        </p>
      </div>
      {clicked ? (
        <p
          className={`border-2 p-3 rounded-md text-sm ${
            theme ? "text-gray-200" : "text-gray-500"
          }`}
        >
          request sent
        </p>
      ) : (
        <button
          className={`p-3 rounded-md hover:border-indigo-600 hover:text-indigo-600 text-sm transition-all duration-300 ${
            !theme
              ? "text-gray-500 border-2 border-gray-200"
              : "text-gray-200 border-2 border-gray-500"
          }`}
          onClick={handleClick}
        >
          Add friend
        </button>
      )}
    </div>
  );
};
