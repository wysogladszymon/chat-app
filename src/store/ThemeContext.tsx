import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ThemeContextProps {
  theme: boolean; // 1 - dark, 0 - light
  switchTheme: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: false,
  switchTheme: () => null,
});

interface ThemeContextProviderProps {
  children?: ReactNode;
}

export const ThemeContextProvider: FC<ThemeContextProviderProps> = ({
  children,
}) => {
  const [theme, setTheme] = useState<boolean>(true);
  const switchTheme = () => setTheme(!theme);
  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (context) return context;
  else throw Error("useThemeContext should be used in ThemeContextProvider");
};