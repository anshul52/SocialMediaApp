import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { REACT_APP_BASE_URL_CLIENT } from "../config/configClients";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );

  const login = async (inputs) => {
    console.log(
      "REACT_APP_BASE_URL_CLIENT:",
      process.env.REACT_APP_BASE_URL_CLIENT
    );
    console.log("REACT_APP_BASE_URL_CLIENT:::", REACT_APP_BASE_URL_CLIENT);
    const res = await axios.post(
      REACT_APP_BASE_URL_CLIENT + "auth/loginUser",
      inputs
      // {
      //   withCredentials: true,
      // }
    );
    if (res.data.status === true) {
      setCurrentUser(res.data.token);
      toast.success(res.data.message);
    } else if (res.data.status === false) {
      toast.error(res.data.message);
    }
  };

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
