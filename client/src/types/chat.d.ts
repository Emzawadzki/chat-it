interface ChatMessage {
  addresseeId: number;
  content: string;
}

interface SentChatMessage extends ChatMessage {
  type: "NEW_MESSAGE";
}
