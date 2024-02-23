import { FC, useEffect, useRef, useState } from "react";

import {} from "firebase/firestore";
import { useAuthContext } from "../../store/AuthContext";
import { Arrow } from "../Arrow";
import { IoMdSearch } from "react-icons/io";
import { inboxInterface } from "../ChatApp";
import { ChatInfo } from "../ChatInfo";
import { useThemeContext } from "../../store/ThemeContext";

interface SearchChatMenuProps {
  inbox: inboxInterface[];
  today: Date | null;
  chatInfoClick: (u: inboxInterface) => Promise<void>;
}

export const SearchChatMenu: FC<SearchChatMenuProps> = ({
  inbox,
  today,
  chatInfoClick,
}) => {
  const { currentUser } = useAuthContext();
  if (currentUser) {
    const bottomRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<string>("");
    const [searchedUsers, setSearchedUsers] = useState<inboxInterface[]>(inbox);
    const [err, setErr] = useState<string>("");
    const { theme } = useThemeContext();
    const [isFocused, setIsFocused] = useState(false);

    const handleUserChange = (newUser: string) => {
      setUser(newUser);
      const usersLeft = inbox.filter(
        (elem) => elem.user.displayName.slice(0, newUser.length) === newUser
      );
      setSearchedUsers(usersLeft);
      if (usersLeft.length < 1)
        setErr(
          `We are really sorry, but no users found for your search "${newUser}"`
        );
      if (!newUser) setSearchedUsers(inbox);
    };

    useEffect(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "instant" });
      }
    }, [isFocused]);

    return (
      <div className="w-full h-full flex flex-col p-5 overflow-hidden">
        <div className="flex gap-3 w-full items-center mb-5 ">
          <Arrow />
          <h1 className="text-3xl pl-3 ">Search for a chat</h1>
        </div>
        <div className="relative mt-4 mb-10">
          <IoMdSearch
            size={"20px"}
            className="absolute top-[50%] left-1 -translate-y-[50%]"
          />
          <input
            className={`text-gray-700 outline-none  pr-4 pt-4 pb-4 pl-7 rounded-2xl  w-52 focus:w-[40%] transition-all duration-1000 focus:min-w-52`}
            type="text"
            placeholder="search for a chat..."
            value={user}
            onChange={(e) => handleUserChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <div
          className={` grow flex flex-col justify-self-end overflow-auto gap-4`}
        >
          {searchedUsers.length > 0 ? (
            searchedUsers.map((u) => (
              <ChatInfo
                className={`max-w-[600px] rounded-3xl hover:text-indigo-600 transition-all duration-300 ${
                  theme
                    ? " border-2 border-gray-500"
                    : " border-2 border-gray-200"
                }`}
                my={false}
                onClick={() => chatInfoClick(u)}
                key={u.user.uid}
                lastmsg={""}
                date={""}
                picURL={u.user.photoURL}
                name={u.user.displayName}
              >
                {console.log(
                  "data: (today) ",
                  today?.toDateString(),
                  "message date",
                  new Date(u.lastmsg.date).toDateString()
                )}
              </ChatInfo>
            ))
          ) : (
            <p>{err}</p>
          )}
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }
};
