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
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
} from "firebase/firestore";
import { useActiveContext } from "../../store/ActiveContext";
import { useAuthContext } from "../../store/AuthContext";
import { db } from "../../config/firebase";
import { createChat } from "../../store/chatFunctions";

interface ChatAppProps {}
export interface User {
  displayName: string;
  email: string;
  uid: string;
  photoURL: string;
}
export interface friendRequest extends User {
  displayNameLower: string;
}
export interface message {
  date: Date | null;
  content: string;
  uid: string;
}
export interface inboxInterface {
  messages: message[];
  lastmsg: message;
  user: User;
}
export const ChatApp: FC<ChatAppProps> = () => {
  const { activeState, dispatchActive } = useActiveContext();
  const [inbox, setInbox] = useState<inboxInterface[]>([]);
  const [friendRequests, setFriendRequests] = useState<friendRequest[]>([]);
  const { currentUser } = useAuthContext();
  const handleFriendReq = () => {
    dispatchActive({ type: "FRIEND_REQUEST", payload: null });
  };
  const handleAddFriend = () => {
    dispatchActive({ type: "ADD_FRIEND", payload: null });
  };

  const handledecline = async (id: string) => {
    if (!currentUser) return;
    const requestRef = doc(db, "friendrequests", currentUser.uid);

    const users = friendRequests.filter((u) => u.uid !== id);
    await updateDoc(requestRef, {
      users: users,
    });
    setFriendRequests(users);
  };
  const handleacceptance = async (us: friendRequest) => {
    if (!currentUser) return;
    createChat(us.uid, currentUser.uid);
    handledecline(us.uid);
    dispatchActive({ type: "CHAT", payload: {user: us, messages:[]} });
  };
  const handleClick = (u : inboxInterface) => {
    if (!currentUser) return;
    dispatchActive({type: "CHAT", payload: {user: u.user, messages:u.messages} })
  }
  useEffect(() => {
    const f = async () => {
      const unsub =
        currentUser &&
        onSnapshot(doc(db, "friendrequests", currentUser.uid), (doc) => {
          setFriendRequests((doc.data()?.users as friendRequest[]) || []);
        });
      if (unsub) return () => unsub();
    };

    currentUser && currentUser.uid && f();

    const g = async () => {
      if (currentUser) {
        const q = query(collection(db, currentUser.uid));
        const inb: inboxInterface[] = [];
        const unsub =
          currentUser &&
          onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const inter: inboxInterface = {
                messages: doc.data().messages,
                lastmsg: doc.data().lastmsg,
                user: doc.data().user,
              };
              inb.push(inter);
            });
            inb.sort((a, b) => {
              if (a.lastmsg.date === null && b.lastmsg.date === null) {
                  return 0; 
              } else if (a.lastmsg.date === null) {
                  return 1; 
              } else if (b.lastmsg.date === null) {
                  return -1;
              } else {
                  if (a.lastmsg.date < b.lastmsg.date) return -1;
                  if (a.lastmsg.date > b.lastmsg.date) return 1;
                  return 0;
              }
          });
            setInbox(inb);
          });
        if (unsub) return () => unsub();
      }
    };
    currentUser && currentUser.uid && g();
  }, [currentUser?.uid, handleacceptance]);

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
          {inbox.map((u) => (
            <ChatInfo
            onClick={() => handleClick(u)}
              key={u.user.uid}
              lastmsg={u.lastmsg.content}
              date={u.lastmsg.date}
              picURL={u.user.photoURL}
              name={u.user.displayName}
            />
          ))}
        </div>
        <UserData />
      </div>
      {/* current Chat */}
      <div className="w-full h-full bg-gray-100 flex flex-col ">
        {activeState.chat && (
          <Messages name={activeState.chat.user.displayName}>
            {activeState.chat.messages.map((msg)=><Message my={currentUser?.uid === msg.uid} date={msg.date}/>)}
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
