import "./App.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./context/Context";
import Links from "./components/Links";


function App() {
  const { state, dispatch } = useContext(GlobalContext);

  const firebaseConfig = {
    apiKey: "AIzaSyBMu5b42XdRRY_qdIaXlFmZGfsHshZwfqQ",
    authDomain: "msgnest.firebaseapp.com",
    projectId: "msgnest",
    storageBucket: "msgnest.firebasestorage.app",
    messagingSenderId: "364879098363",
    appId: "1:364879098363:web:6722c78ef9b7d530a65b5e",
    measurementId: "G-C0H0P5DVVD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  return (
    <>
      <Links className='bg-themeDarkBG' />
    </>
  );
}

export default App;
