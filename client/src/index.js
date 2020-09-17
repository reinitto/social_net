import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserProvider from "./context/user";
import ConversationsProvider from "./context/conversations";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <ConversationsProvider>
        <App />
      </ConversationsProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
