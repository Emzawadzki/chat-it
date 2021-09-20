import axios from "axios";

export class BaseApi {
  static baseUrl = "/api";

  static postRequest = async (url: string, body: object) =>
    axios.post(this.baseUrl + url, body);

  static getRequest = async <ResponseType>(url: string) =>
    axios.get<ResponseType>(this.baseUrl + url).then((res) => res.data);
}
