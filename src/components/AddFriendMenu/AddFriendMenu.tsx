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

type fetchedUser = {
  email: string;
  displayName: string;
  photoURL: string | null;
  uid: string;
};
interface AddFriendMenuProps {}

export const AddFriendMenu: FC<AddFriendMenuProps> = () => {
  const [user, setUser] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<fetchedUser[]>([]);
  const { currentUser } = useAuthContext();

  const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const usersRef = collection(db, "users");

    const q = query(
      usersRef,
      where("displayNameLower", ">=", user.toLowerCase()),
      where("displayNameLower", "<", user.toLowerCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const users: fetchedUser[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().uid !== currentUser?.uid)
        users.push({
          email: String(doc.data().email),
          displayName: String(doc.data().displayName),
          photoURL: doc.data().photoURL,
          uid: String(doc.data().uid),
        });
    });
    setSearchedUsers(users);
  };

  const handleClick = async (id: string) => {
    try {
      const docRef = doc(db, "friendrequests", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          users: [
            {
              email: currentUser?.email,
              displayName: currentUser?.displayName,
              photoURL: currentUser?.photoURL,
              uid: currentUser?.uid,
            } ,
          ] as fetchedUser[],
        });
      } else {
        const ans = await checkExistance(id);
        if (ans) return;
        const userData = docSnap.data();
        await updateDoc(docRef, {
          users: [
            ...userData.users,
            {
              email: currentUser?.email,
              displayName: currentUser?.displayName,
              photoURL: currentUser?.photoURL,
              uid: currentUser?.uid,
            },
          ] as fetchedUser[],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkExistance = async (id: string) => {
    try {
      const docRef = doc(db, "friendrequests", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (userData && userData.users) {
          const data : fetchedUser[] = userData.users;
          const ans = data.some((i) => i.uid === currentUser?.uid);
          return ans;
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col p-10 ">
      <h1 className="text-3xl pl-3">Add Friend</h1>
      <input
        className={`outline-none mt-4 p-4 rounded-2xl mb-10 w-52 focus:w-[40%] transition-all duration-1000 focus:min-w-52`}
        type="text"
        placeholder="search for a friend..."
        value={user}
        onChange={(e) => setUser(e.target.value)}
        onKeyDown={handleKey}
      />
      <div
        className={` grow flex flex-col justify-self-end overflow-auto gap-4`}
      >
        {searchedUsers.map((user) => (
          <AddFriendUser
            initial={false}
            key={user.uid}
            email={user.email}
            displayName={user.displayName}
            photoURL={user.photoURL}
            onClick={() => handleClick(user.uid)}
          />
        ))}
      </div>
    </div>
  );
};
