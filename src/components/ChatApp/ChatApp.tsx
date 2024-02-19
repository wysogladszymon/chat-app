import { FC, useEffect, useState } from "react";
import {
  ToggleThemeButton,
  AddFriend,
  FriendRequests,
  Messages,
  Message,
  FriendRequestsMenu,
  AddFriendMenu,
  UserData,
  ChatInfo,
  Welcome,
  FriendRequestUser,
} from "../";
import pic from "../../assets/defaultPicture.png";
import { arrayRemove, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useActiveContext } from "../../store/ActiveContext";
import { useAuthContext } from "../../store/AuthContext";
import { db } from "../../config/firebase";
import { createChat } from "../../store/chatFunctions";
import { User } from "firebase/auth";

interface ChatAppProps {}

interface friendRequest {
  displayName: string;
  email: string;
  uid: string;
  photoURL: string;
  displayNameLower: string;
}
export const ChatApp: FC<ChatAppProps> = () => {
  const { activeState, dispatchActive } = useActiveContext();
  const [friendRequests, setFriendRequests] = useState<friendRequest[]>([]);
  const { currentUser } = useAuthContext();
  const handleFriendReq = () => {
    dispatchActive({ type: "FRIEND_REQUEST", payload: null });
  };
  const handleAddFriend = () => {
    dispatchActive({ type: "ADD_FRIEND", payload: null });
  };

  useEffect(() => {
    const f = async () => {
      const unsub =
        currentUser &&
        onSnapshot(doc(db, "friendrequests", currentUser.uid), (doc) => {
          setFriendRequests(doc.data()?.users as friendRequest[]);
        });
      if (unsub) return () => unsub();
    };

    currentUser && currentUser.uid && f();
  }, [currentUser?.uid]);

  const handledecline = async (id: string) => {
    if (!currentUser) return;
    const requestRef = doc(db, 'friendrequests', currentUser.uid);
    // console.log(requestRef);
    // const document = await getDoc(requestRef)
    // console.log(document.data());
    const users = friendRequests.filter((u) => u.uid !== id)
    await updateDoc(requestRef, {
      users: users
    })
    setFriendRequests(users)    
  };
  const handleacceptance = (us : User) => {
    if (!currentUser) return;
    createChat(us.uid, currentUser.uid);
    handledecline(us.uid);
    dispatchActive({type: "CHAT", payload: us })
  };
  return (
    <div className=" h-screen flex justify-center items-center w-screen">
      {/* sidebar */}
      <div className="flex flex-col border-r-2 h-full relative pt-5 max-w-[512px]">
        <div className="flex align-center justify-end ">
          <ToggleThemeButton />
        </div>
        <div className="mt-20 ">
          <AddFriend onClick={handleAddFriend} />
          <FriendRequests
            onClick={handleFriendReq}
            count={friendRequests.length}
          />
        </div>
        <p className="p-4 text-gray-400 text-sm">chats</p>
        <div className={` grow flex flex-col justify-self-end overflow-auto`}>
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
        {activeState.addFriend && <AddFriendMenu />}
        {activeState.friendRequest && (
          <FriendRequestsMenu>
            {friendRequests.map((r) => (
              <FriendRequestUser
                key={r.uid}
                displayName={r.displayName}
                email={r.email}
                photoURL={r.photoURL}
                decline={() => handledecline(r.uid)}
                accept={() => handleacceptance(r)}
              />
            ))}
          </FriendRequestsMenu>
        )}
        {!activeState.friendRequest &&
          !activeState.chat &&
          !activeState.addFriend && <Welcome />}
      </div>
    </div>
  );
};
