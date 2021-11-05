import { useMutation, useQuery, useQueryClient } from "react-query"
import { useHistory } from "react-router-dom"

import { UserApi } from "../api/UserApi"
import { QUERY } from "../config/queries"
import { ConversationApi } from "../api/ConversationApi"
import { useUserContext } from "../providers/UserProvider"

export const Users: React.FC = () => {
  const { data } = useQuery(QUERY.ALL_USERS, UserApi.getAll);
  const queryClient = useQueryClient();
  const { push } = useHistory();
  const { mutate } = useMutation(ConversationApi.create, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(QUERY.ALL_CONVERSATIONS);
      push(`chat/${data.conversationId}`);
    }
  })

  const { user: currentUser } = useUserContext();

  const createConversation = async (userId: number) => {
    mutate({ attendeeIds: [userId] })
  }

  return <ul>
    {data?.users.filter(user => user.id !== currentUser!.id).map(user => (
      <li key={user.id} onClick={() => createConversation(user.id)}>{user.name}</li>
    ))}
  </ul>
}