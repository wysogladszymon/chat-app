import { FC, useEffect, useState } from "react";
import debounce from "lodash/debounce";
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
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useActiveContext } from "../../store/ActiveContext";
import { useAuthContext } from "../../store/AuthContext";
import { db } from "../../config/firebase";
import { getChatID } from "../../store/chatFunctions";

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
    // if (!currentUser) return;

    // const combinedID = getChatID(currentUser.uid, us.uid);
    // const docum = (await getDoc(doc(db, "chats", combinedID))).exists();
    // // if (docum) return;

    // //creates chat
    // await setDoc(doc(db, "chats", combinedID), { messages: [] });
    // //creates userchat

    // const doc1 = await getDoc(doc(db, "userChats", currentUser.uid));
    // const doc2 = await getDoc(doc(db, "userChats", us.uid));

    // if (!doc1.exists()) 
    //   await setDoc(doc(db, "userChats", currentUser.uid), { messages: [] });
    // const mss = doc1.data().messages;
    // mss.push({user: {
    //   uid: us.uid,
    //   email: us.email,
    //   displayName: us.displayName,
    //   photoURL: us.photoURL,
    // },lastmsg: {
    //   content: "",
    //   date: null,
    //   uid: "",
    // }});
    //   await updateDoc(doc(db, "userChats", currentUser.uid), {
    //   messages:mss
    // });

    // if (!doc2.exists()) 
    //   await setDoc(doc(db, "userChats", us.uid), { messages: [] });
    //   const mss2 = doc2.data().messages;
    //   mss2.push({user: {
    //     uid: us.uid,
    //     email: us.email,
    //     displayName: us.displayName,
    //     photoURL: us.photoURL,
    //   },lastmsg: {
    //     content: "",
    //     date: null,
    //     uid: "",
    //   }});
    //     await updateDoc(doc(db, "userChats", currentUser.uid), {
    //     messages:mss
    //   });
    // dispatchActive({ type: "CHAT", payload: { user: us, messages: [] } });
    // handledecline(us.uid);
  };

  const handleClick = (u: inboxInterface) => {
    if (!currentUser) return;
    const combinedID = getChatID(currentUser.uid, u.user.uid);

    dispatchActive({ type: "CHAT", payload: { user: u.user, messages: [] } });
  };
  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!currentUser || !currentUser.uid) return;

      const friendRequestsUnsub = onSnapshot(
        doc(db, "friendrequests", currentUser.uid),
        (doc) => {
          setFriendRequests((doc.data()?.users as friendRequest[]) || []);
        }
      );

      return () => friendRequestsUnsub();
    };

    const fetchUserChats = async () => {
      if (!currentUser || !currentUser.uid) return;

      const userChatsUnsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          if (doc && doc.data()) {
            console.log(Object.entries(doc.data().messages.entries));
          }
        }
      );

      return () => userChatsUnsub();
    };
    const DEBOUNCE_DELAY = 2000;
    const debouncedFetchFriendRequests = debounce(
      fetchFriendRequests,
      DEBOUNCE_DELAY
    );
    const debouncedFetchUserChats = debounce(fetchUserChats, DEBOUNCE_DELAY);

    const fetchAllData = async () => {
      await debouncedFetchFriendRequests();
      await debouncedFetchUserChats();
    };

    currentUser?.uid && fetchAllData();

    return () => {
      debouncedFetchFriendRequests.cancel();
      debouncedFetchUserChats.cancel();
    };
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
              date={new Date()}
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
            {activeState.chat.messages.map((msg, index) => (
              <Message
                my={currentUser?.uid === msg.uid}
                key={index}
                date={new Date()}
              >
                {msg.content}
              </Message>
            ))}
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
