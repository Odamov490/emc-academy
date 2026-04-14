import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyBU_hTOtzeJ7tkDUsTvWE6nBgtJMYWf2Cg",
  authDomain: "emc-academy-e8e45.firebaseapp.com",
  projectId: "emc-academy-e8e45",
  storageBucket: "emc-academy-e8e45.firebasestorage.app",
  messagingSenderId: "931383524380",
  appId: "1:931383524380:web:4fd0831ed282026b1573d9",
  measurementId: "G-4MSMLVXTM6"
};

const app = initializeApp(firebaseConfig);
export default app;