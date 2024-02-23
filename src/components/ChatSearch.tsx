import { FC } from "react";
import { useThemeContext } from "../store/ThemeContext";
import { IoMdSearch } from "react-icons/io";

interface ChatSearchProps {
  onClick: () => void;
  className?: string;
}

export const ChatSearch: FC<ChatSearchProps> = ({
  onClick,
  className,
}) => {
  const { theme } = useThemeContext();
  return (
    <button
      onClick={onClick}
      className={`${className || ""} ${
        theme ? "hoverDarkColor text-gray-200" : "hoverLightColor text-gray-500"
      } p-10 w-full flex h-12 group  items-center justify-start cursor-pointer shrink-0 transition-all duration-300`}
    >
      <IoMdSearch
        size={"40px"}
        className={`p-2 border cursor-pointer text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 rounded-lg transition-all duration-300`}
      />
      <p
        className={`mr-auto group-hover:text-indigo-600 transition-all duration-300 text-start ml-6 relative`}
      >
        Search for a chat
      </p>
    </button>
  );
};
