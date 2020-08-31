import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserProvider from "./context/user";
import FriendsProvider from "./context/friends";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <FriendsProvider>
        <App />
      </FriendsProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
