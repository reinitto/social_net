import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserProvider from "./context/user";
import FriendsProvider from "./context/friends";
import ConversationsProvider from "./context/conversations";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <FriendsProvider>
        <ConversationsProvider>
          <App />
        </ConversationsProvider>
      </FriendsProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
