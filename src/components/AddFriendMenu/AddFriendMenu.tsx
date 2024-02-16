import { FC, ReactNode, useState } from "react";

interface AddFriendMenuProps {
  children?: ReactNode;
}

export const AddFriendMenu: FC<AddFriendMenuProps> = ({ children }) => {
  const [user, setUser] = useState<string>("");

  return (
    <div className="pl-10 pt-10 ">
      <h1 className='text-3xl'>Add Friend</h1>
      <input
        className={`outline-none mt-4 p-4 rounded-2xl `}
        type="text"
        placeholder="search for a friend..."
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
    </div>
  );
};
