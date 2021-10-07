import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom"

import { ChatApi } from "../api/ChatApi";
import { MessageForm } from "../components/MessageForm";
import { MessagesList } from "../components/MessagesList";
import { useUserContext } from "../providers/UserProvider";

import "./Chat.css";

export const Chat: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const { user } = useUserContext();

  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const validateMessage = (msg: unknown): msg is ChatMessage => {
    return typeof msg === "object" && msg !== null && msg.hasOwnProperty("content") && msg.hasOwnProperty("addresseeId")
  }

  useEffect(() => {
    if (params.id && !ws) {
      const webSocket = ChatApi.createWebSocket();
      webSocket.onmessage = (ev: MessageEvent<any>) => {
        try {
          const jsonMessage = JSON.parse(ev.data)
          if (!validateMessage(jsonMessage)) throw new Error("Message format invalid!")
          setMessages(messages => [...messages, { content: jsonMessage.content, addresseeId: jsonMessage.addresseeId }])
        } catch (e) {
          console.log(e)
        }
      }
      setWs(webSocket);
    }
  }, [params.id, ws])

  if (!params.id) return <Redirect to="/" />

  return <div className="Chat">
    <MessagesList messages={messages} userId={user!.id} />
    <MessageForm addresseeId={Number(params.id)} webSocket={ws} />
  </div>
}