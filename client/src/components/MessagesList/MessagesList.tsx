import "./MessagesList.css";

interface MessagesListProps {
  messages: ChatMessage[];
  userId: number;
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, userId }) => {
  return <ul className="MessagesList">
    {messages.map((message, index) => (
      <li className={`MessagesList__item${message.addresseeId === userId ? " MessagesList__item--received" : ""}`} key={index}>
        {message.content}
      </li>
    ))}
  </ul>
}