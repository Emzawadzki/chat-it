import { BaseApi } from "./BaseApi";

interface GetAllResponse {
  conversations: ConversationListData[];
}

export class ConversationApi extends BaseApi {
  static getAll = async () => this.getRequest<GetAllResponse>("/conversations");
}
