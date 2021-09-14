import { BaseApi } from "./BaseApi";

interface RegisterRequestBody {
  username: string;
  password: string;
}

export class AuthApi extends BaseApi {
  static register = async (body: RegisterRequestBody) =>
    this.postRequest("/register", body);
}
