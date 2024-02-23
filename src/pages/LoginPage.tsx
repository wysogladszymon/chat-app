import { FC, useState } from "react";
import { Login } from "../components";
import { useThemeContext } from "../store/ThemeContext";
import { ToggleThemeButton } from "../components";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider } from "../config/firebase";
import { useAuthContext } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
interface LoginPageProps {}

export const LoginPage: FC<LoginPageProps> = () => {
  const { theme } = useThemeContext();
  const [error, setError] = useState<string>("");
  const { setCurrentUser } = useAuthContext();
  const nav = useNavigate();

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, email } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    console.log("LOGIN");

    try {
      setError("");
      await signInWithEmailAndPassword(
        auth,
        String(email),
        String(password)
      ).then((userCredential) => {
        const { user } = userCredential;
        console.log(user);
        setCurrentUser(user);
        nav("/");
      });
    } catch (err) {
      setError("Something went wrong!");
    }
  };
  const googlelogin = async () => {
    await signInWithPopup(auth, googleProvider).then(async (userCredential) => {
      const userdata = userCredential.user;
      console.log("Registered succesfully: ", userdata);

      setCurrentUser(userdata);

      await setDoc(doc(db, "users", userdata.uid), {
        displayName: userdata.displayName,
        displayNameLower: userdata.displayName?.toLowerCase(),
        email: userdata.email,
        photoURL: userdata.photoURL,
        uid: userdata.uid,
      });
      nav("/");
    });
  };

  return (
    // <div style={{minWidth:'100vw'}}>
    <div
      className={`relative min-w-[100vw] min-h-[100vh] flex items-center justify-center ${
        theme ? "bg-gray-900" : "bg-blue-200"
      } `}
    >
      <div className="absolute top-10 right-10">
        <ToggleThemeButton />
      </div>
      <div>
        <Login
          loginFunction={logIn}
          loginGoogle={googlelogin}
          link={"/signup"}
          title="Chat App"
          theme={theme}
          error={error}
        ></Login>
      </div>
    </div>
  );
};
