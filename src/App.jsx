import React, { useEffect, useContext, useState } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// pages
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useThemeStore } from "./store/useThemeStore";
import { GlobalContext } from "./context/Context";

const auth = getAuth();

const App = () => {
  const { state, dispatch, logout } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    document.title = "Welcome - MsgNest";

    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("user", user);
        dispatch({ type: "USER_LOGIN", payload: user });
        const uid = user.uid;
        setLoading(false);
        // ...
      } else {
        // User is signed out
        // ...
        dispatch({ type: "USER_LOGOUT" });
        setLoading(false);
      }
    });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={state.isLogin ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!state.isLogin ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!state.isLogin ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={state.isLogin ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
