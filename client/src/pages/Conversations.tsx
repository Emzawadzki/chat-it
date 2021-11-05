import { useQuery } from "react-query"
import { Link } from "react-router-dom"

import { ConversationApi } from "../api/ConversationApi"
import { QUERY } from "../config/queries"

export const Conversations: React.FC = () => {
  const { data } = useQuery(QUERY.ALL_CONVERSATIONS, ConversationApi.getList);

  return <ul>
    {data?.conversations.map(conv => (
      <li key={conv.conversationId}><Link to={`/chat/${conv.conversationId}`}>Conversation with {conv.username}</Link></li>
    ))}
  </ul>
}