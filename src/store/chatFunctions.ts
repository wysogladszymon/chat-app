import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export function getChatID(id: string, id2: string): string {
  // ids have 28 digits
  return id > id2 ? id + id2 : id2 + id;
}

export async function createChat(id: string, id2: string): Promise<void> {
  const chatid = getChatID(id, id2);
  await setDoc(doc(db, "chats", chatid), { messages: [] });
}

