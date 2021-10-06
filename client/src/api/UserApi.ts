import { BaseApi } from "./BaseApi";

interface GetUserResponse {
  user: UserData;
}

export class UserApi extends BaseApi {
  static getUser = async () => this.getRequest<GetUserResponse>("/user");
}
