// const io = require("socket.io")(server, {
//     cors: {
//       origin: "*",
//     },
//   })

//   let player = []

module.export = (io) => {
  io.on("connection", (socket) => {
    console.log("what is socket:" + socket.id)
    console.log("connected")
    if (!player.includes(socket.id)) {
      player.push(socket.id)
    }

    console.log(player)

    // socket.on("crosswar", (payload) => {
    //   console.log(payload.direction, payload.number, payload.answer)

    //   io.emit("crosswar", payload)
    // })

    socket.on("player", (payload) => {
      console.log(payload.direction, payload.number, payload.answer)

      io.emit("player", payload)
    })

    socket.on("guess", (payload) => {
      console.log(payload.row, payload.col, payload.char)

      io.emit("crosswar", payload)
    })
  })
}
