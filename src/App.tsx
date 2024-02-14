import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SignupPage, LoginPage, Home } from "./pages";
import { auth } from "./config/firebase";

function App() {
  const { currentUser } = auth;
  return (
    <Router>
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
}

export default App;
