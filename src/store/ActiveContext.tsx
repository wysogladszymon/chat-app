import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import { FC } from "react";
import { User } from "../components";
import { message } from "../components";

interface useReducerStateInterface {
  chat: {user: User, messages: message[] } | null | undefined;
  addFriend: boolean;
  friendRequest: boolean;
}
interface useReducerActionInterface {
  type: string;
  payload: {user: User, messages: message[] }| null | undefined;
}

interface ActiveContextInterface {
  activeState: useReducerStateInterface;
  dispatchActive: Dispatch<useReducerActionInterface>;
}

export const ActiveContext = createContext<ActiveContextInterface>({
  activeState: { chat: null, friendRequest: false, addFriend: false },
  dispatchActive: () => {},
});

const activeReducer = (
  state: useReducerStateInterface,
  action: useReducerActionInterface
) => {
  switch (action.type) {
    case "ADD_FRIEND":
      return {
        chat: null,
        addFriend: true,
        friendRequest: false,
      };
    case "FRIEND_REQUEST":
      return {
        chat: null,
        addFriend: false,
        friendRequest: true,
      };
    case "CHAT":
      return {
        addFriend: false,
        friendRequest: false,
        chat: action.payload,
      };
    default:
      return state;
  }
};

interface ActiveContextProviderProps {
  children: ReactNode;
}
export const ActiveContextProvider: FC<ActiveContextProviderProps> = ({
  children,
}) => {
  const [activeState, dispatchActive] = useReducer(activeReducer, {
    chat: null,
    addFriend: false,
    friendRequest: false,
  });

  return (
    <ActiveContext.Provider value={{ activeState, dispatchActive }}>
      {children}
    </ActiveContext.Provider>
  );
};

export const useActiveContext = () => {
  const context = useContext(ActiveContext);

  if (context) return context;
  else throw Error("useActiveContext should be used in ActiveContextProvider");
};
