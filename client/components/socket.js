import io from "socket.io-client"

export let socket = io("http://localhost:8080")

export const initSocket = (socket) => {
  socket.on("connect", () => console.log("Connected~"))
}

export default socket
