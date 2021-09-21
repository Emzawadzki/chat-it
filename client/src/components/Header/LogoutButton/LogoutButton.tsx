import { useMutation, useQueryClient } from "react-query";

import { AuthApi } from "../../../api/AuthApi";
import { QUERY } from "../../../config/queries";
import { useUserContext } from "../../../providers/UserProvider";

export const LogoutButton: React.FC = () => {
  const { mutate } = useMutation(AuthApi.logout);
  const { invalidateQueries } = useQueryClient();
  const { setUser } = useUserContext();

  const handleClick = () => {
    mutate(undefined, {
      onSettled: () => {
        invalidateQueries(QUERY.USER);
        setUser(null);
      }
    });
  }

  return <button onClick={handleClick}>
    Logout
  </button>
}