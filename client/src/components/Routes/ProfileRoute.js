import React from "react";
import { Route, Redirect } from "react-router-dom";
import ProfilePageLayout from "../Layout/ProfilePageLayout";
import { useUser } from "../../context/user";

const ProtectedRoute = ({ children, ...rest }) => {
  let { user } = useUser();
  if (user === null) {
    return <Redirect to="/login" />;
  }
  return (
    <Route {...rest}>
      <ProfilePageLayout>{children}</ProfilePageLayout>
    </Route>
  );
};

export default ProtectedRoute;
