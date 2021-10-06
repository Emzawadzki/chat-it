import { NavLink } from "react-router-dom";

import { useUserContext } from "../../providers/UserProvider";

import { LogoutButton } from "./LogoutButton";

import "./Header.css";

export const Header: React.FC = () => {
  const { user } = useUserContext();

  const isUserSettled = user !== undefined;
  const isLoggedIn = isUserSettled && user !== null;

  const userInfo = isUserSettled ? `Hello, ${user?.name ?? "Guest"}` : "Loading ...";

  return <header className="Header">
    <ul className="Header__list">
      <li className="Header__list-item"><NavLink exact className="Header__link" to="/">Home</NavLink></li>
      {!isLoggedIn && <>
        <li className="Header__list-item"><NavLink className="Header__link" to="/register">Register</NavLink></li>
        <li className="Header__list-item"><NavLink className="Header__link" to="/login">Login</NavLink></li>
      </>}
      {isLoggedIn && <li className="Header__list-item"><NavLink className="Header__link" to="/users">Users</NavLink></li>}
    </ul>
    <div className="Header__auth-box">
      <p className="Header__user-info">{userInfo}</p>
      {isLoggedIn && <LogoutButton />}
    </div>
  </header>
}