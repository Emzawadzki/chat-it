import { BaseApi } from "./BaseApi";

interface LoginRequestBody {
  username: string;
  password: string;
}

interface RegisterRequestBody extends LoginRequestBody {}

interface LoginResponse {
  user: UserData;
}

interface RegisterResponse extends LoginResponse {}

export class AuthApi extends BaseApi {
  static register = async (body: RegisterRequestBody) =>
    this.postRequest<RegisterResponse>("/register", body);

  static login = async (body: LoginRequestBody) =>
    this.postRequest<LoginResponse>("/login", body);

  static logout = async () => this.postRequest("/logout", {});
}
