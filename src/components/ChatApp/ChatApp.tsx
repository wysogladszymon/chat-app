import { FC, ReactNode } from "react";
import { UserData, ChatInfo } from "../";
import {
  ToggleThemeButton,
  AddFriend,
  FriendRequests,
  Messages,
  Message,
} from "../";
import pic from "../../assets/defaultPicture.png";


interface ChatAppProps {
  children?: ReactNode;
}

export const ChatApp: FC<ChatAppProps> = ({ children }) => {
  

  return (
    <div className=" h-screen flex justify-center items-center w-screen">
      {/* sidebar */}
      <div className="flex flex-col border-r-2 h-full relative pt-5 max-w-[512px]">
        <div className=" flex align-center justify-end ">
          <ToggleThemeButton />
        </div>
        <div className="mt-20 ">
          <AddFriend />
          <FriendRequests />
        </div>
        <p className="p-4 text-gray-400 text-sm">chats</p>
        <div className=" grow">
          <ChatInfo name={'Natalka'} lastmsg={"What's up?"} date={new Date()} picURL={pic}/>
        </div>
        <UserData />
      </div>
      {/* current Chat */}
      <Messages>
        <Message my={true} date={new Date()}>
          Hello
        </Message>
        <Message my={false} date={new Date()}>
          What's up?
        </Message>
        <Message my={false} date={new Date()}>
          What's up? Haloooooooooooooooooooooooooooooooooo
        </Message>
        <Message my={false} date={new Date()}>
          What's up?
        </Message>
      </Messages>
    </div>
  );
};
