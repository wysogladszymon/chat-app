import { FC, ReactNode, useState } from "react";
import { Signup } from "../components";
import { useThemeContext } from "../store/ThemeContext";
import { ToggleThemeButton } from "../components";
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../store/AuthContext";

interface SignupPageProps {
  children?: ReactNode;
}

export const SignupPage: FC<SignupPageProps> = ({ children }) => {
  const { theme } = useThemeContext();
  const [error, setError] = useState<string>("");
  const nav = useNavigate();
  const { setCurrentUser } = useAuthContext();

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let { username, password, email } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    username = String(username);
    password = String(password);
    email = String(email);

    try {
      setError("");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: username,
      }).then(() => {
        setCurrentUser(res.user);
        console.log("Registered succesfully: ", res.user);
      });
    } catch (err) {
      const eerr = err as AuthError;
      console.log(eerr.code);

      setError(eerr?.message);
    }
  };
  
  const googlesignup = async () => {
    const res = await signInWithPopup(auth, googleProvider).then(
      (userCredential) => {
        const userdata = userCredential.user;
        console.log("Registered succesfully: ", userdata);

        setCurrentUser(userdata);
        nav("/");
      }
    );
  };
  return (
    <div
      className={`relative min-w-[100vw] min-h-[100vh] flex items-center justify-center ${
        theme ? "bg-gray-900" : "bg-blue-200"
      } `}
    >
      <div className="absolute top-10 right-10">
        <ToggleThemeButton />
      </div>
      <div>
        <Signup
          signupFunction={signUp}
          signupGoogle={googlesignup}
          link={"/login"}
          title="Chat App"
          theme={theme}
          error={error}
        ></Signup>
      </div>
    </div>
  );
};
