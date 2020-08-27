import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUser } from "../../context/user";

const LoggedOutRoute = ({ children, ...rest }) => {
  let { user } = useUser();
  if (user) {
    return <Redirect to="/" />;
  } else {
    return <Route {...rest}>{children}</Route>;
  }
};

export default LoggedOutRoute;
