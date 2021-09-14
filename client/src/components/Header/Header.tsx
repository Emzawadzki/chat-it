import { NavLink } from "react-router-dom";

import "./Header.css";

export const Header: React.FC = () => {
    return <header className="Header">
        <ul className="Header__list">
            <li className="Header__list-item"><NavLink exact className="Header__link" to="/">Home</NavLink></li>
            <li className="Header__list-item"><NavLink className="Header__link" to="/register">Register</NavLink></li>
        </ul>
    </header>
}