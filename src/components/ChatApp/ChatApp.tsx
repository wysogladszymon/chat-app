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
import { formatDate } from "../../store/dateManagement";
import { useThemeContext } from "../../store/ThemeContext";

const DEBOUNCE_DELAY = 0;

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
  date: string;
  content: string;
  uid: string;
  photoURL?: string;
}
export interface inboxInterface {
  lastmsg: message;
  user: User;
}
export const ChatApp: FC<ChatAppProps> = () => {
  const { currentUser } = useAuthContext();
  if (currentUser) {
    const { activeState, dispatchActive } = useActiveContext();
    const [inbox, setInbox] = useState<inboxInterface[]>([]);
    const [friendRequests, setFriendRequests] = useState<friendRequest[]>([]);
    const [messages, setMessages] = useState<message[]>([]);
    const { theme } = useThemeContext();

    const handleFriendReq = () => {
      dispatchActive({ type: "FRIEND_REQUEST", payload: null });
      setMessages([]);
    };
    const handleAddFriend = () => {
      dispatchActive({ type: "ADD_FRIEND", payload: null });
      setMessages([]);
    };

    const handledecline = async (id: string) => {
      const requestRef = doc(db, "friendrequests", currentUser.uid);

      //delete friendRequest
      const users = friendRequests.filter((u) => u.uid !== id);
      await updateDoc(requestRef, {
        users: users,
      });
      setFriendRequests(users);
    };

    const handleacceptance = async (us: friendRequest) => {
      // create chat (request cannot be send if the chat already exists)
      const combinedID = getChatID(us.uid, currentUser.uid);
      await setDoc(doc(db, "chats", combinedID), {
        messages: [], //type message[]
      });

      //create userChats
      try {
        const doc1 = doc(db, "userChats", currentUser.uid);
        const currUserDoc = await getDoc(doc1);
        //if its first user chat
        if (!currUserDoc.exists()) {
          await setDoc(doc1, {
            chats: [
              {
                user: {
                  email: us.email,
                  displayName: us.displayName,
                  photoURL: us.photoURL,
                  uid: us.uid,
                },
                lastmsg: {
                  date: null,
                  content: "",
                  uid: "",
                },
              },
            ],
          });
          //if user has other chats
        } else {
          const chats = currUserDoc.data().chats;
          chats.push({
            user: {
              email: us.email,
              displayName: us.displayName,
              photoURL: us.photoURL,
              uid: us.uid,
            },
            lastmsg: {
              date: null,
              content: "",
              uid: "",
            },
          });
          await updateDoc(doc1, {
            chats: [...chats],
          });
        }
        const doc2 = doc(db, "userChats", us.uid);
        const userDoc = await getDoc(doc2);
        //if its first user chat
        if (!userDoc.exists()) {
          await setDoc(doc2, {
            chats: [
              {
                user: {
                  email: currentUser.email,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                  uid: currentUser.uid,
                },
                lastmsg: {
                  date: null,
                  content: "",
                  uid: "",
                },
              },
            ],
          });
          //if user has other chats
        } else {
          const chats2 = userDoc.data().chats;
          chats2.push({
            user: {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
            },
            lastmsg: {
              date: null,
              content: "",
              uid: "",
            },
          });
          await updateDoc(doc2, {
            chats: [...chats2],
          });
        }
      } catch (err: any) {
        console.error(err);
      }

      //delete user from requests
      handledecline(us.uid);
      dispatchActive({ type: "CHAT", payload: { user: us, messages: [] } });
    };

    const chatInfoClick = async (u: inboxInterface) => {
      if (u.user !== activeState.chat?.user) setMessages([]);
      try {
        // get messages
        const combinedID = getChatID(currentUser.uid, u.user.uid);
        const doc1 = await getDoc(doc(db, "chats", combinedID));
        if (!doc1.exists()) return;
        const mess = doc1.data().messages.map((msg: message) => {
          return {
            date: msg.date,
            content: msg.content,
            uid: msg.uid,
          };
        });
        console.log(mess);

        dispatchActive({
          type: "CHAT",
          payload: { user: u.user, messages: mess },
        });
      } catch (err) {
        console.error(err);
      }
    };
    useEffect(() => {
      const fetchFriendRequests = async () => {
        const requestsRef = doc(db, "friendrequests", currentUser.uid);
        try {
          const reqUnsub = onSnapshot(
            requestsRef,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const reqData = docSnapshot.data();
                console.log("requests:", reqData);

                const data = reqData.users.map((el: friendRequest) => {
                  return {
                    displayName: el.displayName,
                    email: el.email,
                    uid: el.uid,
                    photoURL: el.photoURL,
                    displayNameLower: el.displayNameLower,
                  };
                });
                setFriendRequests(data);
              } else {
                console.log("No request data available");
              }
            },
            (error: any) => {
              console.error("Error fetching user chats:", error);
            }
          );

          return () => reqUnsub();
        } catch (error) {
          console.error("Error setting up user chats listener:", error);
        }
      };
      const fetchUserChats = async () => {
        const userChatsRef = doc(db, "userChats", currentUser.uid);
        try {
          const userChatsUnsub = onSnapshot(
            userChatsRef,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const chatData = docSnapshot.data();
                const data: inboxInterface[] = chatData.chats.map(
                  (el: inboxInterface) => {
                    return {
                      user: {
                        email: el.user.email,
                        displayName: el.user.displayName,
                        photoURL: el.user.photoURL,
                        uid: el.user.uid,
                      },
                      lastmsg: {
                        content: el.lastmsg.content,
                        date: el.lastmsg.date,
                        uid: el.lastmsg.uid,
                      },
                    };
                  }
                );
                data.sort(
                  (a, b) =>
                    new Date(b.lastmsg.date).getTime() -
                    new Date(a.lastmsg.date).getTime()
                );
                setInbox(data);
              } else {
                console.log("No chat data available");
              }
            },
            (error: any) => {
              console.error("Error fetching user chats:", error);
            }
          );

          return () => userChatsUnsub();
        } catch (error) {
          console.error("Error setting up user chats listener:", error);
        }
      };
      const fetchCurrentMessages = () => {
        //if chat is not active - do nothing
        if (!activeState.chat) return;

        //get chatRef
        const combinedID = getChatID(
          currentUser.uid,
          activeState.chat.user.uid
        );
        const chatRef = doc(db, "chats", combinedID);

        try {
          const chatUnsub = onSnapshot(
            chatRef,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const chatData = docSnapshot.data();

                const data = chatData.messages.map((msg: message) => {
                  return {
                    date: msg.date,
                    content: msg.content,
                    uid: msg.uid,
                    photoURL: msg.photoURL
                  };
                });
                if (!activeState.chat || !activeState.chat.user) return;
                if (
                  getChatID(currentUser.uid, activeState.chat.user.uid) ===
                  combinedID
                )
                  setMessages(data);
              } else {
                console.log("No chat data available");
              }
            },
            (error: any) => {
              console.error("Error fetching user chats:", error);
            }
          );

          return () => chatUnsub();
        } catch (error) {
          console.error("Error setting up user chats listener:", error);
        }
      };
      const debouncedFetchFriendRequests = debounce(
        fetchFriendRequests,
        DEBOUNCE_DELAY
      );
      const debouncedFetchUserChats = debounce(fetchUserChats, DEBOUNCE_DELAY);
      const debouncedFetchCurrMessages = debounce(
        fetchCurrentMessages,
        DEBOUNCE_DELAY
      );
      const fetchAllData = async () => {
        await debouncedFetchFriendRequests();
        await debouncedFetchUserChats();
        await debouncedFetchCurrMessages();
      };

      currentUser?.uid && fetchAllData();

      console.log("1");
      return () => {
        debouncedFetchFriendRequests.cancel();
        debouncedFetchUserChats.cancel();
      };
    }, [currentUser, activeState]);

    return (
      <div
        className={`h-screen flex justify-center items-center w-screen ${
          theme ? "text-white" : "text-gray-950"
        }`}
      >
        {/* sidebar */}
        <div
          className={`flex flex-col h-full  relative pt-5 max-w-[512px] ${
            !theme ? "bg-white" : "bg-gray-950"
          }`}
        >
          <div className="flex align-center justify-end ">
            <ToggleThemeButton />
          </div>
          <div className="mt-20 ">
            <AddFriend
              className={`${
                activeState.addFriend
                  ? theme
                    ? "activeDarkColor"
                    : "activeLightColor"
                  : ""
              }`}
              onClick={handleAddFriend}
            />
            <FriendRequests
              className={`${
                activeState.friendRequest
                  ? theme
                    ? "activeDarkColor"
                    : "activeLightColor "
                  : ""
              }`}
              onClick={handleFriendReq}
              count={friendRequests ? friendRequests.length : 0}
            />
          </div>
          <p className="p-4 text-gray-400 text-sm">chats</p>
          <div className={` grow flex flex-col justify-self-end overflow-auto`}>
            {inbox.map((u) => (
              <ChatInfo
              className={`${activeState.chat && activeState.chat.user.uid === u.user.uid ? (theme ? 'activeDarkColor': 'activeLightColor') : ''}`}
                my={u.lastmsg.uid === currentUser.uid}
                onClick={() => chatInfoClick(u)}
                key={u.user.uid}
                lastmsg={u.lastmsg.content}
                date={
                  u.lastmsg.date ? formatDate(new Date(u.lastmsg.date)) : ""
                }
                picURL={u.user.photoURL}
                name={u.user.displayName}
              />
            ))}
          </div>
          <UserData />
        </div>
        {/* current Chat */}
        <div
          className={`w-full h-full flex flex-col ${
            theme ? "activeDarkColor" : "activeLightColor"
          }`}
        >
          {activeState.chat && (
            <Messages
              name={
                activeState.chat.user ? activeState.chat.user.displayName : ""
              }
            >
              {messages.map((msg, index) => (
                <Message
                  my={currentUser?.uid === msg.uid}
                  key={index}
                  photoURL={msg.photoURL}
                  date={formatDate(new Date(msg.date))}
                >
                  {msg.photoURL ? '' : msg.content}
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
  }
};
