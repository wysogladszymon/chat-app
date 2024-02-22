import { FC } from "react";
import { LuUser } from "react-icons/lu";
import { useThemeContext } from "../store/ThemeContext";

interface FriendRequestsProps {
  onClick: () => void;
  count: number;
  className?: string;
}

export const FriendRequests: FC<FriendRequestsProps> = ({
  onClick,
  count,
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
      <LuUser
        size={"40px"}
        className={`p-2 border cursor-pointer text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 rounded-lg transition-all duration-300`}
      />
      <p
        className={`mr-auto group-hover:text-indigo-600 transition-all duration-300 text-start ml-6 relative`}
      >
        Friend requests
        {count > 0 && (
          <span className="absolute w-4 h-4 bg-indigo-600 rounded-full right-[-1rem] top-0 text-center justify-items-center text-xs text-white center">
            {count}
          </span>
        )}
      </p>
    </button>
  );
};
