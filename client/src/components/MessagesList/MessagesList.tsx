import "./MessagesList.css";

interface MessagesListProps {
  messages: ChatMessage[];
  userId: number;
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, userId }) => {
  return <ul className="MessagesList">
    {messages.map((message, index) => (
      <li className={`MessagesList__item${message.authorId !== userId ? " MessagesList__item--received" : ""}`} key={index}>
        {message.text}
      </li>
    ))}
  </ul>
}