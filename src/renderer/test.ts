import HttpsProxyAgent from "@/utils/proxy/https";
import { IncomingMessage } from "http";
import Websocket from "ws";

////////////////////////////////////
////////////// SERVER //////////////
////////////////////////////////////

const wss = new Websocket.Server({ port: 8080 });

wss.on("connection", (ws, req: IncomingMessage) => {
  const f = req.headers["x-forwarded-for"];
  const ip = f ? (f as string).split(/\s*,\s*/)[0] : req.headers.host;
  console.log("connection from " + ip);
  ws.on("message", message => {
    console.log("received: ", message);
  });

  ws.send("something");
});

// ////////////////////////////////////
// ////////////////////////////////////
// ////////////////////////////////////

// HTTP/HTTPS proxy to connect to
const proxy = "http://186.193.186.3:20183";
console.log("using proxy server ", proxy);

// WebSocket endpoint for the proxy to connect to
const endpoint = "ws://localhost:8080";
// const parsed = parse(endpoint);
console.log("attempting to connect to WebSocket", endpoint);

// create an instance of the `HttpsProxyAgent` class with the proxy server information
// const options = parse(proxy);

const agent = new HttpsProxyAgent(proxy);

// finally, initiate the WebSocket connection
const socket = new Websocket(endpoint, { agent } as any);

socket.on("open", () => {
  console.log('"open" event!');
  socket.send("hello world");
});

socket.on("message", (data: any, flags: any) => {
  console.log('"message" event! ', data, flags);
  socket.close();
});

socket.on("error", (error: any) => console.error(error));
