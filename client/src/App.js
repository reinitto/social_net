import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Home, Login, Register } from "./pages";
import PageLayout from "./components/Layout/PageLayout";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <PageLayout>
        <Switch>
          <ProtectedRoute exact path="/">
            <Home />
          </ProtectedRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Redirect to="/login" />
        </Switch>
      </PageLayout>
    </Router>
  );
}

export default App;
