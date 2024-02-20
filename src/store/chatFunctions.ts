import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";


export async function createChat(id: string, id2: string): Promise<void> {
  const usersRef = doc(db, "users", id);
  const usersRef2 = doc(db, "users", id2);
  const snap = await getDoc(usersRef);
  const snap2 = await getDoc(usersRef2);

  if (snap.exists() && snap2.exists()) {
    const userData = snap.data();
    const userData2 = snap2.data();
    await setDoc(doc(db, id, id2), { messages: [], user: userData2, lastmsg: {date: null, content: '', uid: ''}});
    await setDoc(doc(db, id2, id), { messages: [], user: userData , lastmsg: {date: null, content: '', uid: ''}});
  }
}

