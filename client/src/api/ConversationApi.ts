import { BaseApi } from "./BaseApi";

interface GetListResponse {
  conversations: ConversationListData[];
}

export class ConversationApi extends BaseApi {
  static getList = async () =>
    this.getRequest<GetListResponse>("/conversations");
}
