import { BaseApi } from "./BaseApi";

interface RegisterRequestBody {
  username: string;
  password: string;
}

interface GetUserResponse {
  username: string;
}

export class AuthApi extends BaseApi {
  static register = async (body: RegisterRequestBody) =>
    this.postRequest("/register", body);

  static getUser = async () => this.getRequest<GetUserResponse>("/user");
}
