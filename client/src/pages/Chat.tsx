import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Redirect, useParams } from "react-router-dom"

import { ChatApi } from "../api/ChatApi";
import { ConversationApi } from "../api/ConversationApi";
import { MessageForm } from "../components/MessageForm";
import { MessagesList } from "../components/MessagesList";
import { QUERY } from "../config/queries";
import { useUserContext } from "../providers/UserProvider";

import "./Chat.css";

export const Chat: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const conversationId = params.id && parseInt(params.id);
  const isConversationIdValid = typeof conversationId === "number" && !Number.isNaN(conversationId);
  const { user } = useUserContext();
  const { data } = useQuery([QUERY.ALL_CONVERSATIONS, conversationId], () => ConversationApi.getById(conversationId as number), { enabled: isConversationIdValid });

  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<ChatMessage[]>(data?.messages || [])

  const validateMessage = (msg: unknown): msg is ChatMessage => {
    return typeof msg === "object" && msg !== null && msg.hasOwnProperty("text") && msg.hasOwnProperty("id") && msg.hasOwnProperty("authorId")
  }

  useEffect(() => {
    if (isConversationIdValid && !ws) {
      const webSocket = ChatApi.createWebSocket();
      webSocket.onmessage = (ev: MessageEvent<any>) => {
        try {
          const jsonMessage = JSON.parse(ev.data)
          if (!validateMessage(jsonMessage)) throw new Error("Message format invalid!")
          const { text, authorId, id } = jsonMessage;
          setMessages(messages => [...messages, { text, authorId, id }])
        } catch (e) {
          console.log(e)
        }
      }
      setWs(webSocket);
    }
  }, [isConversationIdValid, ws])

  useEffect(() => {
    if (data?.messages) {
      setMessages(data?.messages)
    }
  }, [data?.messages])

  if (!isConversationIdValid) return <Redirect to="/" />

  return <div className="Chat">
    <MessagesList messages={messages} userId={user!.id} />
    <MessageForm conversationId={conversationId} webSocket={ws} />
  </div>
}