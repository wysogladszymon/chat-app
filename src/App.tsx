import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SignupPage, LoginPage, Home } from "./pages";
import { useAuthContext } from "./store/AuthContext";
import { useEffect, useState } from "react";

function App() {
  const { currentUser } = useAuthContext();
  const [app, setApp] = useState(<>Loading...</>)
  
  useEffect(() => {
    setApp(<Router>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" /> : <LoginPage />}
        />
      </Routes>
    </Router>
  );
  }, [currentUser]);
  return app
    
}

export default App;
