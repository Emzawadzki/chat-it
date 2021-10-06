import { useQuery } from "react-query"

import { UserApi } from "../api/UserApi"
import { QUERY } from "../config/queries"

export const Chat: React.FC = () => {
  const { data } = useQuery(QUERY.ALL_USERS, UserApi.getAll)

  return <ul>
    {data?.users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
}