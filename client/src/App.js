import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Home, Login, Register, Profile } from "./pages";
import PageLayout from "./components/Layout/PageLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoggedOutRoute from "./components/LoggedOutRoute";
function App() {
  return (
    <Router>
      <PageLayout>
        <Switch>
          <ProtectedRoute exact path="/">
            <Home />
          </ProtectedRoute>
          <ProtectedRoute exact path="/account">
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
