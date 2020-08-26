import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Home, Login, Register, Account, Profile } from "./pages";
import { CssBaseline } from "@material-ui/core";
import PageLayout from "./components/Layout/PageLayout";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import LoggedOutRoute from "./components/Routes/LoggedOutRoute";
function App() {
  return (
    <Router>
      <CssBaseline />
      <PageLayout>
        <Switch>
          <ProtectedRoute exact path="/">
            <Home />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account">
            <Account />
          </ProtectedRoute>
          <ProtectedRoute exact path="/profile/:profileId">
            <Profile />
          </ProtectedRoute>
          <LoggedOutRoute path="/login">
            <Login />
          </LoggedOutRoute>
          <LoggedOutRoute path="/register">
            <Register />
          </LoggedOutRoute>
          <Redirect to="/login" />
        </Switch>
      </PageLayout>
    </Router>
  );
}

export default App;
