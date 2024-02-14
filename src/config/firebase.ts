import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTW_Auncqv3AOSo5mcbqNbvHuxujFkpQg",
  authDomain: "chatapp-e8817.firebaseapp.com",
  projectId: "chatapp-e8817",
  storageBucket: "chatapp-e8817.appspot.com",
  messagingSenderId: "756483973233",
  appId: "1:756483973233:web:ed5c5384c20b174f8a3bd0",
};

// Initialize Firebase
const app : FirebaseApp = initializeApp(firebaseConfig);
export const auth : Auth= getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);

