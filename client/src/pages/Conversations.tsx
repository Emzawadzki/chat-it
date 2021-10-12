import { useQuery } from "react-query"
import { Link } from "react-router-dom"

import { ConversationApi } from "../api/ConversationApi"
import { QUERY } from "../config/queries"

export const Conversations: React.FC = () => {
  const { data } = useQuery(QUERY.ALL_CONVERSATIONS, ConversationApi.getList);

  return <ul>
    {data?.conversations.map(user => (
      <li key={user.id}><Link to={`/chat/${user.id}`}>Conversation with {user.username}</Link></li>
    ))}
  </ul>
}