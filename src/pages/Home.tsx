import { FC, ReactNode } from "react";
import { ChatApp } from "../components";
interface HomeProps {
  children?: ReactNode;
}

export const Home: FC<HomeProps> = () => {
  return <><ChatApp/></>;
};
