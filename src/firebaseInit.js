import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4Io8MliqNGILH24HEbS2ViqVx2eLtNrM",
  authDomain: "photo-folio-58212.firebaseapp.com",
  projectId: "photo-folio-58212",
  storageBucket: "photo-folio-58212.appspot.com",
  messagingSenderId: "1070245130434",
  appId: "1:1070245130434:web:192360505871d077d88b5b",
  measurementId: "G-7M24XBK52V",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
