import { BaseApi } from "./BaseApi";

interface GetUserResponse {
  user: UserData | null;
}

interface GetAllResponse {
  users: UserData[];
}

export class UserApi extends BaseApi {
  static getUser = async () => this.getRequest<GetUserResponse>("/user");

  static getAll = async () => this.getRequest<GetAllResponse>("/users");
}
