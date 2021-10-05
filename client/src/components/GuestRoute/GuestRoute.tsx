import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useUserContext } from "../../providers/UserProvider";

interface GuestRouteProps extends RouteProps { }

export const GuestRoute: React.FC<GuestRouteProps> = ({ ...routeProps }) => {
  const { user } = useUserContext();
  const isUserSettled = user !== undefined;
  const isLoggedIn = isUserSettled && user !== null;
  if (isLoggedIn) {
    return <Redirect to="/" />
  }
  if (!isUserSettled) {
    return <h1>Loading user...</h1>
  }

  return <Route {...routeProps} />
}
