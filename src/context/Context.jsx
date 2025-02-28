import React, { createContext, useReducer } from "react";
import { reducer } from "./Reducer";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";

export const GlobalContext = createContext("Initial Value");

let data = {
  user: {},
  isLogin: null,
};

export default function ContextProvider({ children }) {
  const login = async (email, password) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: "USER_LOGIN", payload: userCredential.user });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const [state, dispatch] = useReducer(reducer, data);
  const logout = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        dispatch({ type: "USER_LOGOUT" });
        console.log("signout", auth);
      })
      .catch((error) => {
        console.log("error in signout", error);
      });
  };
  return ( 
    <GlobalContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </GlobalContext.Provider>
  );
}
