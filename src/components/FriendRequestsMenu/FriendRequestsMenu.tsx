import { FC, ReactNode } from "react";

interface FriendRequestsMenuProps {
  children?: ReactNode;
}

export const FriendRequestsMenu: FC<FriendRequestsMenuProps> = ({
  children,
}) => {
  return (
    <div className="pl-10 pt-10 ">
      <h1 className='text-3xl'>Friend Requests</h1>
    </div>
  );
};
