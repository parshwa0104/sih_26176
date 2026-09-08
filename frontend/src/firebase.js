import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8m24jwZ2orlpp0U_e4Shuehu1h6U6HY8",
  authDomain: "orca-b5511.firebaseapp.com",
  projectId: "orca-b5511",
  storageBucket: "orca-b5511.firebasestorage.app",
  messagingSenderId: "420868870235",
  appId: "1:420868870235:web:00037fb928caf77f3a2f7e",
  measurementId: "G-N2JQ7PVLMF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const analytics = getAnalytics(app);
