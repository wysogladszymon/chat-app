import { FC, ReactNode } from "react";
import { Arrow } from "../";
interface FriendRequestsMenuProps {
  children?: ReactNode;
}

export const FriendRequestsMenu: FC<FriendRequestsMenuProps> = ({
  children,
}) => {
  return (
    <div className="w-full h-full flex flex-col p-5 overflow-hidden">
      <div className="flex gap-3 w-full items-center mb-6 ">
        <Arrow />
        <h1 className="text-3xl pl-3"> Friend requests</h1>
      </div>
      <div
        className={` grow flex flex-col justify-self-end overflow-auto gap-3`}
      >
        {children}
      </div>
    </div>
  );
};
