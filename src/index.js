import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { DarkModeContextProvider } from "./context/DarkModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <DarkModeContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </DarkModeContextProvider>
  </AuthContextProvider>
);
