import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUser } from "../../context/user";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  let { user } = useUser();
  if (user === null) {
    return <Redirect to="/login" />;
  }
  return (
    <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
  );
};

export default ProtectedRoute;
