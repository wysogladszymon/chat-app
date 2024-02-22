import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";
import styles from "./Messages.module.css";
import { useAuthContext } from "../../store/AuthContext";
import { useActiveContext } from "../../store/ActiveContext";
import { getChatID } from "../../store/chatFunctions";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { User, message } from "../ChatApp";
import { useThemeContext } from "../../store/ThemeContext";

interface MessagesProps {
  children?: ReactNode;
  name: string;
}

export const Messages: FC<MessagesProps> = ({ children, name }) => {
  const { currentUser } = useAuthContext();
  const { activeState } = useActiveContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {theme} = useThemeContext();
  if (currentUser && activeState.chat) {
    const [message, setMessage] = useState<string>("");
    const sendMessage = async () => {
      // get chatID and place there message
      const combinedID = getChatID(
        currentUser?.uid,
        activeState.chat?.user.uid ?? ""
      );

      const doc1 = doc(db, "chats", combinedID);
      const chatDoc = await getDoc(doc1);
      const newmsg = {
        date: (new Date()).toString(),
        content: message,
        uid: currentUser.uid,
      };
      if (!chatDoc.exists()) return;
      const msgs = chatDoc.data().messages.map((ms: message) => {
        return {
          date: ms.date,
          content: ms.content,
          uid: ms.uid,
        };
      });
      msgs.push(newmsg);
      await updateDoc(doc1, {
        messages: [...msgs],
      });

      //update userChats with lastmsg
      if (activeState.chat) {
        const udoc1 = doc(db, "userChats", currentUser.uid);
        const userchat1 = await getDoc(udoc1);
        const data1 = userchat1.exists()
          ? userchat1
              .data()
              .chats.map((el: { lastmsg: message; user: User }) => {
                return {
                  user: el.user,
                  lastmsg:
                    el.user.uid === activeState.chat?.user.uid
                      ? newmsg
                      : el.lastmsg,
                };
              })
          : [];
        await updateDoc(udoc1, { chats: data1 });

        //update userChats with lastmsg
        const udoc2 = doc(db, "userChats", activeState.chat.user.uid);
        const userchat2 = await getDoc(udoc2);
        const data2 = userchat2.exists()
          ? userchat2
              .data()
              .chats.map((el: { lastmsg: message; user: User }) => {
                return {
                  user: el.user,
                  lastmsg:
                    el.user.uid === currentUser.uid ? newmsg : el.lastmsg,
                };
              })
          : [];
        await updateDoc(udoc2, { chats: data2 });

        setMessage("");
      }
    };

    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [children]);
    return (
      <div className="w-full h-full flex flex-col ">
        <div className={`flex ${theme ? 'border-b-gray-700 border-b-4': "border-b-4"} p-5 items-center`}>
          <h1 className={`text-2xl ${theme ? 'text-gray-200' : 'text-gray-800'} ml-20`}> {name}</h1>
        </div>
        <div className={`${styles.scroll} grow flex flex-col justify-self-end`}>
          {children}
          <div ref={messagesEndRef} />
        </div>
        <div className={`flex max-h-32 p-5  items-center justify-center ${theme ? 'text-gray-200' : 'text-gray-500'}`}>
          <div className="w-10 mr-5">
            <label
              className={`${styles.changePhoto}`}
              htmlFor={styles.fileinput}
            >
              <GoFileMedia size={"40px"} className="cursor-pointer p-2 " />
            </label>
            <input
              type="file"
              id={styles.fileinput}
              style={{ display: "none" }}
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`h-full outline-none p-5 grow rounded-2xl text-wrap bg-transparent ${theme ? 'border-gray-700 border-2': "border-2"}`}
            placeholder="write a message..."
          />
          <button className="h-10 w-10 mr-5 ml-5">
            <LuSend
              onClick={sendMessage}
              size={"40px"}
              className="cursor-pointer border p-2 bg-gray-200 rounded-full"
            />
          </button>
        </div>
      </div>
    );
  }
};
