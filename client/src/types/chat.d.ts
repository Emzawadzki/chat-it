interface ChatMessage {
  authorId: number;
  text: string;
  id: number;
}

interface SentChatMessage extends Pick<ChatMessage, "text"> {
  type: "NEW_MESSAGE";
  conversationId: number;
}
