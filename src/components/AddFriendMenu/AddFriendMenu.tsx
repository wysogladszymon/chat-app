import { FC, useState } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {} from "firebase/firestore";
import { AddFriendUser } from "../AddFriendUser";
import { useAuthContext } from "../../store/AuthContext";
import { getChatID } from "../../store/chatFunctions";
import { Arrow } from "../Arrow";
import { IoMdSearch } from "react-icons/io";

type fetchedUser = {
  email: string;
  displayName: string;
  photoURL: string | null;
  uid: string;
};
interface AddFriendMenuProps {}

export const AddFriendMenu: FC<AddFriendMenuProps> = () => {
  const { currentUser } = useAuthContext();
  if (currentUser) {
    const [user, setUser] = useState<string>("");
    const [searchedUsers, setSearchedUsers] = useState<fetchedUser[]>([]);
    const [err, setErr] = useState<string>("");
    const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      setErr("");
      if (e.key !== "Enter" || user.length < 1) return;

      const usersRef = collection(db, "users");

      const q = query(
        usersRef,
        where("displayNameLower", ">=", user.toLowerCase()),
        where("displayNameLower", "<", user.toLowerCase() + "\uf8ff")
      );
      const userFriend = await getDoc(doc(db, "userChats", currentUser.uid));
      const friendIDs: string[] = userFriend.exists()
        ? userFriend.data().chats.map((el: any) => el.user.uid)
        : [];
      const querySnapshot = await getDocs(q);
      const users: fetchedUser[] = [];
      querySnapshot.forEach((doc) => {
        if (
          doc.data().uid !== currentUser?.uid &&
          !friendIDs.includes(doc.data().uid)
        )
          users.push({
            email: String(doc.data().email),
            displayName: String(doc.data().displayName),
            photoURL: doc.data().photoURL,
            uid: String(doc.data().uid),
          });
      });
      setSearchedUsers(users);
      if (!(users.length > 0))
        setErr(
          `We are really sorry, but no users found for your search "${user}"`
        );
    };

    const handleClick = async (id: string) => {
      if (!currentUser) return;
      try {
        //see if the chat already exists
        const combinedID = getChatID(id, currentUser.uid);
        const chatDoc = await getDoc(doc(db, "chats", combinedID));
        if (chatDoc.exists()) {
          console.log("Chat already exists");
          return;
        }
        const docRef = doc(db, "friendrequests", id);
        const docSnap = await getDoc(docRef);
        // if doesnt exist - create one
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            users: [
              {
                email: currentUser?.email,
                displayName: currentUser?.displayName,
                photoURL: currentUser?.photoURL,
                uid: currentUser?.uid,
              },
            ] as fetchedUser[],
          });
          // if exist - update one
        } else {
          const userData: any[] = docSnap.data().users;
          // add new request
          if (!currentUser) return;
          userData.push({
            email: currentUser?.email,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
            uid: currentUser?.uid,
          });
          //remove the duplicates
          const uniqueData = userData.filter(
            (user, index, self) =>
              index === self.findIndex((t) => t.uid === user.uid)
          );
          await updateDoc(docRef, {
            users: [...uniqueData],
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className="w-full h-full flex flex-col p-5">
        <div className="flex gap-3 w-full items-center mb-5 ">
          <Arrow />
          <h1 className="text-3xl pl-3 ">Add Friend</h1>
        </div>
        <div className='relative mt-4 mb-10'>
          <IoMdSearch size={"20px"} className='absolute top-[50%] left-1 -translate-y-[50%]'/>
          <input
            className={`text-gray-700 outline-none  pr-4 pt-4 pb-4 pl-7 rounded-2xl  w-52 focus:w-[40%] transition-all duration-1000 focus:min-w-52`}
            type="text"
            placeholder="search for a friend..."
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <div
          className={` grow flex flex-col justify-self-end overflow-auto gap-4`}
        >
          {searchedUsers.length > 0 ? (
            searchedUsers.map((user) => (
              <AddFriendUser
                initial={false}
                key={user.uid}
                email={user.email}
                displayName={user.displayName}
                photoURL={user.photoURL}
                onClick={() => handleClick(user.uid)}
              />
            ))
          ) : (
            <p>{err}</p>
          )}
        </div>
      </div>
    );
  }
};
