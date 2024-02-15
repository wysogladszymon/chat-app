import { FC, ReactNode } from "react";
import { UserData } from "../";
import { ToggleThemeButton, AddFriend, FriendRequests, Messages } from "../";
interface ChatAppProps {
  children?: ReactNode;
}

export const ChatApp: FC<ChatAppProps> = ({ children }) => {
  return (
    <div className=" h-screen flex justify-center items-center w-screen">
      {/* sidebar */}
      <div className="flex flex-col border-r-2 h-full relative pt-5">
        <div className=" flex align-center justify-end ">
          <ToggleThemeButton />
        </div>
        <div className="mt-20 ">
          <AddFriend />
          <FriendRequests />
        </div>
        <p className="p-4 text-gray-400 text-sm">chats</p>
        <div className=" grow">{/* chats */}</div>
        <UserData />
      </div>
      {/* current Chat */}
      <Messages />
    </div>
  );
};
