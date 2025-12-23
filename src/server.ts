import dotenv from "dotenv"
dotenv.config()

import http from "http";
import { WebSocketServer } from "ws";
import app from "./index"; // Express app
import { connectDb } from "./db"

import { setBroadcast, getCart  } from "./controllers/pos_controllers/cartController";

const PORT  = process.env.PORT;

async function startServer() {
  try {
    await connectDb()
    console.log("✅ Database connected")

    const server = http.createServer(app)

    const wss = new WebSocketServer({
      server,
      path: "/api/cart/ws",
    })

    function broadcastToClients(data: any) {
      const message = JSON.stringify(data)
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    }

    setBroadcast(broadcastToClients)

    wss.on("connection", (ws) => {
      console.log("🟢 WebSocket client connected")

      ws.on("message", (message) => {
        console.log("Received:", message.toString())
      })

      ws.send(JSON.stringify({
        event: "updateCart",
        payload: getCart()
      }))
    })

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    })

  } catch (err) {
    console.error("❌ Server startup failed", err)
    process.exit(1)
  }
}

startServer()
