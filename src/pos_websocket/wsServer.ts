import { WebSocketServer } from "ws";
import http from "http";

let clients: any[] = [];

export function initWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server, path: "/api/cart/ws" });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    clients.push(ws);

    ws.on("close", () => {
      clients = clients.filter(c => c !== ws);
      console.log("Client disconnected");
    });
  });
}

export function broadcast(message: any) {
  clients.forEach(ws => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}
