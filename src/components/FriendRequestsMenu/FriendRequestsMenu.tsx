import { FC, ReactNode } from "react";

interface FriendRequestsMenuProps {
  children?: ReactNode;
}

export const FriendRequestsMenu: FC<FriendRequestsMenuProps> = ({
  children,
}) => {
    return (
      <div className="w-full h-full flex flex-col p-10 ">
        <h1 className="text-3xl pl-3 mb-6"> Friend requests</h1>
        <div
          className={` grow flex flex-col justify-self-end overflow-auto gap-4`}
        >{children}
        </div>
      </div>
    );
  };
