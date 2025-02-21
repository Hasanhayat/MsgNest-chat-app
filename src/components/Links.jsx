import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import { GlobalContext } from "../context/Context";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Welcome from "../pages/Welcome";
import Home from "../pages/Home";


const Links = () => {
  const { state, dispatch, logout } = useContext(GlobalContext);

  // return state.isLogin ? (
  //   <>
  //   <Routes>
  //     <Route path="/" element={<Welcome />} />
  //     <Route path="/home" element={<Home />} />
  //     <Route path="*" element={<Navigate to={"/"} />} />
  //   </Routes>
  //   </>
  // ) : (
  return(
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
    
  )
  // );
};

export default Links;
