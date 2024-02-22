import { FC, ReactNode } from "react";
import { useThemeContext } from "../../store/ThemeContext";
// import styles from "./Message.module.css";

interface MessageProps {
  children?: ReactNode;
  my: boolean;
  date: string;
  photoURL?: string;
}

export const Message: FC<MessageProps> = ({ children, my, date, photoURL }) => {
  const { theme } = useThemeContext();
  const clsColor = my
    ? !theme
      ? "bg-blue-200"
      : "bg-blue-600"
    : theme
    ? "bg-gray-600"
    : "bg-gray-300";
  const cls = my ? "ml-auto mr-16" : "ml-16 mr-auto";
  console.log(photoURL);

  return (
    <div className={`${cls} mt-3 mb-3`}>
      {photoURL ? (
        <div
          className={`flex justify-center items-center max-h-96 max-w-96 rounded-lg overflow-hidden`}
        >
          <img
            src={photoURL}
            alt="Uploaded Photo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
            }}
          />
        </div>
      ) : (
        <p
          className={` ${clsColor} rounded-lg p-3 pl-5 pr-5 w-full text-center`}
          style={{ wordWrap: "break-word" }}
        >
          {children}
        </p>
      )}
      <p
        className={`${theme ? "text-gray-100" : "text-gray-400"} text-xs mt-1 ${
          my ? "text-end" : "text-start"
        }`}
      >
        {date}
      </p>
    </div>
  );
};
