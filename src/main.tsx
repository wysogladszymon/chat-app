import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeContextProvider } from "./store/ThemeContext.tsx";
import { AuthContextProvider } from "./store/AuthContext.tsx";
import { ActiveContextProvider } from "./store/ActiveContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <ActiveContextProvider>
          <App />
        </ActiveContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
