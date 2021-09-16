import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";

import { AuthApi } from "../../api/AuthApi";

import "./Header.css";

export const Header: React.FC = () => {
    const { isLoading, data } = useQuery("user", AuthApi.getUser);

    const username = data ? data.username : "Guest"
    const userInfo = isLoading ? "Loading ..." : `Hello, ${username}!`

    return <header className="Header">
        <ul className="Header__list">
            <li className="Header__list-item"><NavLink exact className="Header__link" to="/">Home</NavLink></li>
            <li className="Header__list-item"><NavLink className="Header__link" to="/register">Register</NavLink></li>
        </ul>
        <p className="Header__user-info">{userInfo}</p>
    </header>
}