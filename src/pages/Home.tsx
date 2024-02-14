import { FC, ReactNode } from 'react';

interface HomeProps {
  children?: ReactNode;
}

export const Home: FC<HomeProps> = ({ children }) => {
  return <div className=''>{children} Home</div>;
};
