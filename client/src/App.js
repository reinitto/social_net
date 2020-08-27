import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Home, Login, Register, Account, Profile } from "./pages";
import { CssBaseline } from "@material-ui/core";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import ProfileRoute from "./components/Routes/ProfileRoute";
import LoggedOutRoute from "./components/Routes/LoggedOutRoute";
function App() {
  return (
    <Router>
      <CssBaseline />
      <Switch>
        <ProtectedRoute exact path="/">
          <Home />
        </ProtectedRoute>
        <ProtectedRoute exact path="/account">
          <Account />
        </ProtectedRoute>
        <ProfileRoute exact path="/profile/:profileId">
          <Profile />
        </ProfileRoute>
        <LoggedOutRoute path="/login">
          <Login />
        </LoggedOutRoute>
        <LoggedOutRoute path="/register">
          <Register />
        </LoggedOutRoute>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
