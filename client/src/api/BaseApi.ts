import axios from "axios";

export class BaseApi {
  static baseUrl = "/api";

  static postRequest = async (url: string, body: object) =>
    axios.post(url, body);
}
