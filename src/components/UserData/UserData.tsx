import { FC, ReactNode, useEffect, useState } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { Logout } from "../";
import styles from "./UserData.module.css";
import { useThemeContext } from "../../store/ThemeContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import pic from "../../assets/defaultPicture.png";

interface UserDataProps {
  children?: ReactNode;
}

export const UserData: FC<UserDataProps> = ({ children }) => {
  const { currentUser } = useAuthContext();
  const [photo, setPhoto] = useState<string | undefined | null>(undefined);
  const { theme } = useThemeContext();

  const editPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, String(currentUser?.displayName));
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);
        currentUser &&
          (await updateProfile(currentUser, {
            photoURL: downloadURL,
          }));
        setPhoto(downloadURL);
      });
    });
  };

  useEffect(() => {
    setPhoto(currentUser?.photoURL);
  }, [currentUser, editPhoto]);

  return (
    <div className="flex items-center justify-center p-6 ">
      <div>
        <div
          className={`${styles.profilePhoto}`}
          style={{
            backgroundImage: photo ? `url(${photo})` : `url(${pic})`,
          }}
        >
          {
            <img
              src={photo || pic}
              style={{ aspectRatio: "1 / 1", visibility: "hidden" }}
            />
          }
          <label className={`${styles.changePhoto}`} htmlFor={styles.fileinput}>
            {" "}
            Edit photo
          </label>
          <input
            type="file"
            id={styles.fileinput}
            style={{ display: "none" }}
            accept="image/jpeg, image/png, image/jpg"
            onChange={editPhoto}
          />
        </div>
      </div>
      <div className={`flex flex-col items-center justify-center`}>
        <h1 className={` font-bold text-xl`}>{currentUser?.displayName}</h1>
        <p className={` text-gray-400`}>{currentUser?.email}</p>
      </div>
      <div className='h-12 w-12 ml-20'>
        <Logout />
      </div>
    </div>
  );
};
