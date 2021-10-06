import { useQuery } from "react-query"
import { Link } from "react-router-dom"

import { UserApi } from "../api/UserApi"
import { QUERY } from "../config/queries"
import { useUserContext } from "../providers/UserProvider"

export const Users: React.FC = () => {
  const { data } = useQuery(QUERY.ALL_USERS, UserApi.getAll);
  const { user: currentUser } = useUserContext();

  return <ul>
    {data?.users.filter(user => user.id !== currentUser!.id).map(user => (
      <li key={user.id}><Link to={`/chat/${user.id}`}>{user.name}</Link></li>
    ))}
  </ul>
}