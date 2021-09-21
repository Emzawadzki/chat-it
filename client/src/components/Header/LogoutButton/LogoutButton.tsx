import { useMutation, useQueryClient } from "react-query";

import { AuthApi } from "../../../api/AuthApi";
import { QUERY } from "../../../config/queries";

export const LogoutButton: React.FC = () => {
  const { mutate } = useMutation(AuthApi.logout);
  const { invalidateQueries } = useQueryClient();

  const handleClick = () => {
    mutate(undefined, {
      onSettled: () => {
        invalidateQueries(QUERY.USER)
      }
    });
  }

  return <button onClick={handleClick}>
    Logout
  </button>
}