import { FC, useEffect, useState } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { Logout } from "../";
import styles from "./UserData.module.css";
import { useThemeContext } from "../../store/ThemeContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import pic from "../../assets/defaultPicture.png";
import { doc, updateDoc } from "firebase/firestore";

interface UserDataProps {
}

export const UserData: FC<UserDataProps> = () => {
  const { currentUser } = useAuthContext();
  const [photo, setPhoto] = useState<string | undefined | null>(undefined);
  const { theme } = useThemeContext();

  const editPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, String(currentUser?.displayName));
    await uploadBytesResumable(storageRef, file);
    getDownloadURL(storageRef)
        .then(async (downloadURL ) => {
          console.log("Photo uploaded to storage. File available at", downloadURL);
          if (auth.currentUser){ 
            await updateProfile(auth.currentUser, {
            photoURL: downloadURL
          })
          console.log('Photo added to user information');
          setPhoto(downloadURL);
          await updateDoc(doc(db, 'users', auth.currentUser.uid),{
            photoURL: downloadURL
          })
        }
        });
  };

  useEffect(() => {
    currentUser && setPhoto(currentUser.photoURL);    
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
        <p className={`${theme ? 'text-gray-200' : 'text-gray-500'}`}>{currentUser?.email}</p>
      </div>
      <div className="h-12 w-12 ml-20">
        <Logout />
      </div>
    </div>
  );
};
