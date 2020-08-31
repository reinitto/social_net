import React from "react";
import { Route, Redirect } from "react-router-dom";
import WidePageLayout from "../Layout/WidePageLayout";
import { useUser } from "../../context/user";

const ProtectedRoute = ({ children, ...rest }) => {
  let { user } = useUser();
  if (user === null) {
    return <Redirect to="/login" />;
  }
  return (
    <Route {...rest}>
      <WidePageLayout>{children}</WidePageLayout>
    </Route>
  );
};

export default ProtectedRoute;
