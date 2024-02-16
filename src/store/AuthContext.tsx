import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../config/firebase";
import { User } from "firebase/auth";

export type myUser = User | null;

interface AuthContextProps {
  currentUser: myUser;
  setCurrentUser: Dispatch<SetStateAction<myUser>>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: auth.currentUser,
  setCurrentUser: () => null,
  isLoading: true,
});

interface AuthContextProviderProps {
  children?: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<myUser>(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();

  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{isLoading, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context) return context;
  else throw Error("useAuthContext should be used in AuthContextProvider");
};
