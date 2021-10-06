interface ChatMessage {
  type: "NEW_MESSAGE";
  addresseeId: number;
  content: string;
}
