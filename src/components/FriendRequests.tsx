import { FC } from "react";
import { LuUser } from "react-icons/lu";
import { useThemeContext } from "../store/ThemeContext";

interface FriendRequestsProps {
  onClick: () => void
}

export const FriendRequests: FC<FriendRequestsProps> = ({onClick}) => {
  const { theme } = useThemeContext();
  return (
    <button
    onClick={onClick}
      className={`p-10 w-full flex h-12 group  items-center justify-start cursor-pointer text-gray-400 hover:bg-gray-100 shrink-0 transition-all duration-300`}
    >
      <LuUser
        size={"40px"}
        className={`p-2 border cursor-pointer text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 rounded-lg transition-all duration-300`}
      />
      <p className="w-full group-hover:text-indigo-600 transition-all duration-300 text-start ml-6">
        Friend requests
      </p>
    </button>
  );
};
