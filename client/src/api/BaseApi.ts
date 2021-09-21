import axios from "axios";

export class BaseApi {
  static baseUrl = "/api";

  static postRequest = async <ResponseType>(url: string, body: object) =>
    axios.post<ResponseType>(this.baseUrl + url, body).then((res) => res.data);

  static getRequest = async <ResponseType>(url: string) =>
    axios.get<ResponseType>(this.baseUrl + url).then((res) => res.data);
}
