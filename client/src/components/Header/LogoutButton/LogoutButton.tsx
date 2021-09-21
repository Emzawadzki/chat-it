import { useMutation } from "react-query";

import { AuthApi } from "../../../api/AuthApi";
import { useUserContext } from "../../../providers/UserProvider";

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

  return <button onClick={handleClick}>
    Logout
  </button>
}