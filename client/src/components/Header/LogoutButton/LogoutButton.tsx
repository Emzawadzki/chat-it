import { useMutation } from "react-query";

import { AuthApi } from "../../../api/AuthApi";
import { useUserContext } from "../../../providers/UserProvider";

import "./LogoutButton.css";

export const LogoutButton: React.FC = () => {
  const { mutate } = useMutation(AuthApi.logout);
  const { setUser } = useUserContext();

  const handleClick = () => {
    mutate(undefined, {
      onSettled: () => {
        setUser(null);
      }
    });
  }

  return <button className="LogoutButton" onClick={handleClick}>
    Logout
  </button>
}