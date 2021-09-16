import axios from "axios";

export class BaseApi {
  static baseUrl = "/api";

  static postRequest = async (url: string, body: object) =>
    axios.post(url, body);

  static getRequest = async <ResponseType>(url: string) =>
    axios.get<ResponseType>(url).then((res) => res.data);
}
