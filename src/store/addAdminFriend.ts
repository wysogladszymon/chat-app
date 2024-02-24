import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getChatID } from "./chatFunctions";
import { myUser } from "./AuthContext";
import { db } from "../config/firebase";

const myID = 'adyWy4R6sIZD0RWUySEizQ5w7Np2';

export const addAdminFriend = async (currentUser : myUser) =>{
  if (!currentUser) return;
  const combinedID = getChatID(myID, currentUser.uid);
  const mydoc = await getDoc(doc(db,'users',myID));
  const myuser = mydoc.data();
  if (!myuser) return;

  const docum1 = await getDoc(doc(db, "chats", combinedID));
  if (docum1.exists()) return;
  
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
              email: myuser.email,
              displayName: myuser.displayName,
              photoURL: myuser.photoURL,
              uid: myuser.uid,
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
          email: myuser.email,
          displayName: myuser.displayName,
          photoURL: myuser.photoURL,
          uid: myuser.uid,
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
    const doc2 = doc(db, "userChats", myuser.uid);
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
}