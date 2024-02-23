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
  chat: { user: User; messages: message[] } | null | undefined;
  addFriend: boolean;
  friendRequest: boolean;
  search: boolean;
}
interface useReducerActionInterface {
  type: string;
  payload: { user: User; messages: message[] } | null | undefined;
}

interface ActiveContextInterface {
  activeState: useReducerStateInterface;
  dispatchActive: Dispatch<useReducerActionInterface>;
}

export const ActiveContext = createContext<ActiveContextInterface>({
  activeState: {
    chat: null,
    friendRequest: false,
    addFriend: false,
    search: false,
  },
  dispatchActive: () => {},
});

const activeReducer = (
  state: useReducerStateInterface,
  action: useReducerActionInterface
): useReducerStateInterface => {
  switch (action.type) {
    case "ADD_FRIEND":
      return {
        ...state,
        chat: null,
        addFriend: true,
        friendRequest: false,
        search: false
      };
    case "FRIEND_REQUEST":
      return {
        ...state,
        chat: null,
        addFriend: false,
        friendRequest: true,
        search: false,
      };
    case "CHAT":
      return {
        ...state,
        addFriend: false,
        friendRequest: false,
        chat: action.payload,
        search: false,
      };
    case "SEARCH":
      return {
        ...state,
        addFriend: false,
        friendRequest: false,
        chat: null,
        search: true,
      };
    case "OUT":
      return {
        ...state,
        addFriend: false,
        friendRequest: false,
        chat: null,
        search: false,
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
    search: false,
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
