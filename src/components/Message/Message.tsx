import { FC, ReactNode } from 'react';
import styles from "./Message.module.css";

interface MessageProps {
  children?: ReactNode;
}

export const Message: FC<MessageProps> = ({ children }) => {
  return <div className=''>{children} Message</div>;
};
