import { FC, useState } from "react";
import { Signup } from "../components";
import { useThemeContext } from "../store/ThemeContext";
import { ToggleThemeButton } from "../components";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../store/AuthContext";
import { doc, setDoc } from "firebase/firestore";
interface SignupPageProps {}

export const SignupPage: FC<SignupPageProps> = () => {
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
      });
      setCurrentUser({
        ...res.user,
        displayName: username,
      });
      console.log("Registered succesfully: ", res.user);
      await setDoc(doc(db, "users", res.user.uid), {
        displayName: res.user.displayName,
        displayNameLower: res.user.displayName?.toLowerCase(),
        email: res.user.email,
        photoURL: res.user.photoURL,
        uid: res.user.uid,
      });
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  const googlesignup = async () => {
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
