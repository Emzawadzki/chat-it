import { BaseApi } from "./BaseApi";

interface GetListResponse {
  conversations: ConversationListData[];
}

interface Message {
  id: number;
  text: string;
  authorId: number;
}

interface Attendee {
  id: number;
  username: string;
}

interface GetByIdResponse {
  messages: Message[];
  attendees: Attendee[];
}

export class ConversationApi extends BaseApi {
  static getList = async () =>
    this.getRequest<GetListResponse>("/conversations");
  static getById = async (conversationId: number) =>
    this.getRequest<GetByIdResponse>(`/conversations/${conversationId}`);
}
