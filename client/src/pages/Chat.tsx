import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Redirect, useParams } from "react-router-dom"

import { ChatApi } from "../api/ChatApi";

export const Chat: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const ws = useRef<WebSocket>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (params.id) {
      ws.current = ChatApi.createWebSocket();
      ws.current.onmessage = (ev: MessageEvent<any>) => {
        try {
          const jsonMessage = JSON.parse(ev.data)
          setMessages(messages => [...messages, { content: jsonMessage.content }])
        } catch (e) {
          console.log(e)
        }
      }
    }
  }, [params.id])

  if (!params.id) return <Redirect to="/" />

  const sendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const jsonMessage = {
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