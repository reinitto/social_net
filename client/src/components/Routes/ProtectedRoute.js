import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUser } from "../../context/user";

const ProtectedRoute = ({ children, ...rest }) => {
  let { user } = useUser();
  if (user === null) {
    return <Redirect to="/login" />;
  }
  return <Route {...rest}>{children}</Route>;
};

export default ProtectedRoute;
