import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";

import { AuthApi } from "../../api/AuthApi";
import { QUERY } from "../../config/queries";

import { LogoutButton } from "./LogoutButton";

import "./Header.css";

export const Header: React.FC = () => {
    const { isLoading, data } = useQuery(QUERY.USER, AuthApi.getUser);

    const hasUser = !isLoading && data?.user;

    const username = hasUser ? data.user!.name : "Guest";
    const userInfo = isLoading ? "Loading ..." : `Hello, ${username}!`

    return <header className="Header">
        <ul className="Header__list">
            <li className="Header__list-item"><NavLink exact className="Header__link" to="/">Home</NavLink></li>
            <li className="Header__list-item"><NavLink className="Header__link" to="/register">Register</NavLink></li>
            <li className="Header__list-item"><NavLink className="Header__link" to="/login">Login</NavLink></li>
        </ul>
        <p className="Header__user-info">{userInfo}</p>
        {hasUser && <LogoutButton />}
    </header>
}