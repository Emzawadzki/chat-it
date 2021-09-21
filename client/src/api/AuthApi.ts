import { BaseApi } from "./BaseApi";

interface RegisterRequestBody {
  username: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

type UserData = {
  name: string;
  id: number;
} | null;

interface GetUserResponse {
  user: UserData;
}

interface LoginResponse {
  user: UserData;
}

export class AuthApi extends BaseApi {
  static register = async (body: RegisterRequestBody) =>
    this.postRequest("/register", body);

  static login = async (body: LoginRequestBody) =>
    this.postRequest<LoginResponse>("/login", body);

  static logout = async () => this.postRequest("/logout", {});

  static getUser = async () => this.getRequest<GetUserResponse>("/user");
}
