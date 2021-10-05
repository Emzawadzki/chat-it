import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useUserContext } from "../../providers/UserProvider";

interface ProtectedRouteProps extends RouteProps {
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ ...routeProps }) => {
  const { user } = useUserContext();
  const isUserSettled = user !== undefined;
  const isLoggedIn = isUserSettled && user !== null;
  if (isLoggedIn) {
    return <Route {...routeProps} />
  }
  if (!isUserSettled) {
    return <h1>Loading user...</h1>
  }

  return <Redirect to="/" />
}
