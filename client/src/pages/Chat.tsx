import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Redirect, useParams } from "react-router-dom"

import { ChatApi } from "../api/ChatApi";
import { useUserContext } from "../providers/UserProvider";

export const Chat: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const { user } = useUserContext();

  const ws = useRef<WebSocket>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Omit<ChatMessage, "type">[]>([])

  const validateMessage = (msg: unknown): msg is ChatMessage => {
    return typeof msg === "object" && msg !== null && msg.hasOwnProperty("content") && msg.hasOwnProperty("addresseeId")
  }

  useEffect(() => {
    if (params.id && user) {
      ws.current = ChatApi.createWebSocket();
      ws.current.onmessage = (ev: MessageEvent<any>) => {
        try {
          const jsonMessage = JSON.parse(ev.data)
          if (!validateMessage(jsonMessage)) throw new Error("Message format invalid!")
          setMessages(messages => [...messages, { content: jsonMessage.content, addresseeId: user!.id }])
        } catch (e) {
          console.log(e)
        }
      }
    }
  }, [params.id, user])

  if (!params.id) return <Redirect to="/" />

  const sendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const jsonMessage: ChatMessage = {
      type: "NEW_MESSAGE",
      addresseeId: Number(params.id),
      content: message
    }
    ws.current?.send(JSON.stringify(jsonMessage));
    setMessage("");
  }

  return <>
    <ul>
      {messages.map((message, i) => <li key={i}>{message.content}</li>)}
    </ul>
    <form onSubmit={sendMessage}>
      <input type="text" name="message" id="message" value={message} onChange={e => { setMessage(e.target.value) }} />
      <input type="submit" value="Send" />
    </form></>
}