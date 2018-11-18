import HttpsProxyAgent from "@/utils/proxy/https";
import { request, RequestOptions } from "https";

export default class Spark {
  private static agent: HttpsProxyAgent;

  public static setAgent(proxy: string) {
    this.agent = new HttpsProxyAgent(proxy);
  }

  public static async get<T>(url: string) {
    return this.request<T>(url, "GET");
  }

  public static async post<T>(url: string) {
    return this.request<T>(url, "POST");
  }

  private static async request<T>(url: string, method: string): Promise<T> {
    return new Promise<T>(resolve => {
      const opts: RequestOptions = {
        agent: this.agent as any,
        host: url,
        method,
        path: "/",
        port: 80,
        timeout: 10000
      };
      const post_req = request(opts, res => {
        res.setEncoding("utf8");
        let data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          return resolve(JSON.parse(data));
        });
      });
      // post_req.write("name=john");
      post_req.end();
    });
  }
}
