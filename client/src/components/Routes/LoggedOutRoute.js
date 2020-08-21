import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUser } from "../../context/user";

const LoggedOutRoute = ({ component: Component, ...rest }) => {
  let { user } = useUser();
  if (user) {
    return <Redirect to="/" />;
  }
  return (
    <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
  );
};

export default LoggedOutRoute;
