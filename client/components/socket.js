import io from "socket.io-client"

export let socket = io(window.location.origin)

export const initSocket = (socket) => {
  socket.on("connect", () => console.log("Connected~"))
}

export default socket
