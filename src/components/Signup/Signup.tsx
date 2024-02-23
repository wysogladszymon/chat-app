import { FC, useState } from "react";
import styles from "./Signup.module.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Google } from "../";
import { Link } from "react-router-dom";
interface SignupProps {
  theme?: string | boolean;
  signupFunction: (e: React.FormEvent<HTMLFormElement>) => void;
  signupGoogle: () => void;
  title: string;
  error?: string;
  link: string;
}

export const Signup: FC<SignupProps> = ({
  theme,
  signupFunction,
  signupGoogle,
  title,
  error,
  link,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const handleClick = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  if (!theme || theme === "dark") theme = false;
  else theme = true;

  const eye = isPasswordVisible ? (
    <VscEye
      className={styles.eye}
      color={!theme ? "black" : "white"}
      onClick={handleClick}
      id="togglePassword"
    ></VscEye>
  ) : (
    <VscEyeClosed
      className={styles.eye}
      color={!theme ? "black" : "white"}
      onClick={handleClick}
      id="togglePassword"
    ></VscEyeClosed>
  );

  return (
    <form
      style={{ fontFamily: "Quicksand, sans-serif" }}
      onSubmit={signupFunction}
      className={`${styles.form} ${
        !theme ? styles.lightform : styles.darkform
      }`}
    >
      <div className={`${styles.headercontainer}`}>
        <h1
          className={`${styles.header} ${
            !theme ? styles.lighttext : styles.darktext
          }`}
        >
          {title}{" "}
        </h1>
        <h2
          className={`${styles.signup} ${
            !theme ? styles.lighttext : styles.darktext
          }`}
        >
          Sign Up
        </h2>
      </div>
      <div className={styles.div}>
        <input
          name="username"
          className={`${styles.input} ${
            !theme ? styles.lightinput : styles.darkinput
          }`}
          placeholder="Username"
          type="text"
        />
      </div>
      <div className={styles.div}>
        <input
          name="email"
          className={`${styles.input} ${
            !theme ? styles.lightinput : styles.darkinput
          }`}
          placeholder="Email"
          type="email"
        />
      </div>
      <div className={styles.div}>
        <input
          name="password"
          className={`${styles.input} ${
            !theme ? styles.lightinput : styles.darkinput
          }`}
          placeholder="Password"
          type={isPasswordVisible ? "text" : "password"}
        />
        {eye}
      </div>
      <p className={styles.error}>
        {" "}
        {error}
        <br />{" "}
      </p>
      <button
        className={`${styles.submit} ${
          !theme ? styles.lightbutton : styles.darkbutton
        }`}
      >
        Sign Up
      </button>
      <div
        onClick={signupGoogle}
        className={`${styles.google} ${
          !theme ? styles.lightgoogle : styles.darkgoogle
        }`}
      >
        <Google /> <p className={styles.googletext}>Sign up with Google</p>
      </div>
      <p
        className={`${styles.p} ${!theme ? styles.lighttext : styles.darktext}`}
      >
        Do you have an account? <Link to={link}>Login</Link>
      </p>
    </form>
  );
};
