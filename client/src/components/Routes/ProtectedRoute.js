import React from "react";
import { Route, Redirect } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import { useUser } from "../../context/user";

const ProtectedRoute = ({ children, ...rest }) => {
  let { user, loading } = useUser();
  if (loading) {
    return <div>Loading</div>;
  }
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <Route {...rest}>
      <PageLayout>{children}</PageLayout>
    </Route>
  );
};

export default ProtectedRoute;
