import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </AuthContextProvider>
    </DarkModeContextProvider>
  </Provider>
  // </React.StrictMode>
);
