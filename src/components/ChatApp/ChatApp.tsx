import { FC, ReactNode } from "react";
import { UserData, ChatInfo, Welcome } from "../";
import {
  ToggleThemeButton,
  AddFriend,
  FriendRequests,
  Messages,
  Message,
  FriendRequestsMenu,
  AddFriendMenu
} from "../";
import pic from "../../assets/defaultPicture.png";
import { useActiveContext } from "../../store/ActiveContext";

interface ChatAppProps {
  children?: ReactNode;
}

export const ChatApp: FC<ChatAppProps> = ({ children }) => {
  const { activeState, dispatchActive } = useActiveContext();
  const handleFriendReq = () =>{
    dispatchActive({type:'FRIEND_REQUEST', payload: null});
  };
  const handleAddFriend = () =>{
    dispatchActive({type:'ADD_FRIEND', payload: null})
  };

  return (
    <div className=" h-screen flex justify-center items-center w-screen">
      {/* sidebar */}
      <div className="flex flex-col border-r-2 h-full relative pt-5 max-w-[512px]">
        <div className="flex align-center justify-end ">
          <ToggleThemeButton />
        </div>
        <div className="mt-20 ">
          <AddFriend onClick={handleAddFriend}/>
          <FriendRequests onClick={handleFriendReq}/>
        </div>
        <p className="p-4 text-gray-400 text-sm">chats</p>
        <div className=" grow">
          <ChatInfo
            name={"Natalka"}
            lastmsg={"What's up?"}
            date={new Date()}
            picURL={pic}
          />
        </div>
        <UserData />
      </div>
      {/* current Chat */}
      <div className="w-full h-full bg-gray-100 flex flex-col ">
        {activeState.chat && (
          <Messages>
            <Message my={true} date={new Date()}>
              Hello
            </Message>
            <Message my={false} date={new Date()}>
              What's up?
            </Message>
          </Messages>
        )}
        {activeState.addFriend && <AddFriendMenu /> }
        {activeState.friendRequest && <FriendRequestsMenu /> }
        {!activeState.friendRequest && !activeState.chat && !activeState.addFriend && <Welcome /> }
      </div>
    </div>
  );
};
