import { FormEventHandler, useState } from "react";

import "./MessageForm.css";

interface MessageFormProps {
  addresseeId: number;
  webSocket?: WebSocket;
}

export const MessageForm: React.FC<MessageFormProps> = ({ addresseeId, webSocket }) => {
  const [message, setMessage] = useState("");

  const sendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!webSocket || !trimmedMessage) {
      return;
    }
    const jsonMessage: SentChatMessage = {
      type: "NEW_MESSAGE",
      addresseeId,
      content: trimmedMessage
    }
    webSocket.send(JSON.stringify(jsonMessage));
    setMessage("");
  }

  return <form onSubmit={sendMessage} className="MessageForm">
    <input className="MessageForm__input" type="text" name="message" id="message" value={message} onChange={e => { setMessage(e.target.value) }} />
    <input className="MessageForm__button" type="submit" value="Send" />
  </form>
}