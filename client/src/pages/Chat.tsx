import { Redirect, useParams } from "react-router-dom"

export const Chat: React.FC = () => {
  const params = useParams<{ id?: string }>();

  if (!params.id) return <Redirect to="/" />

  return <h1>Chat page</h1>
}