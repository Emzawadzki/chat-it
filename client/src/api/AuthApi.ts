import { BaseApi } from "./BaseApi";

interface RegisterRequestBody {
  username: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

interface GetUserResponse {
  user: {
    name: string;
    id: number;
  } | null;
}

export class AuthApi extends BaseApi {
  static register = async (body: RegisterRequestBody) =>
    this.postRequest("/register", body);

  static login = async (body: LoginRequestBody) =>
    this.postRequest("/login", body);

  static logout = async () => this.postRequest("/logout", {});

  static getUser = async () => this.getRequest<GetUserResponse>("/user");
}
