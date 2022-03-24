const { db } = require("./db");
const PORT = process.env.PORT || 8080;
const app = require("./app");
const seed = require("../script/seed");

const init = async () => {
  try {
    if (process.env.SEED === "true") {
      await seed();
    } else {
      await db.sync();
    }
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () =>
      console.log(`Mixing it up on port ${PORT}`)
    );
    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });

    // let player = [];

    io.on("connection", (socket) => {
      console.log(`Connection from client ${socket.id}`);

      socket.on("set-info", (userObj) => {
        socket.nickname = userObj.nickname; // this is setting these properties on the client side socket, not the server side
        socket.color = userObj.color;
        socket.host = userObj.host;
        // console.log(socket);
      });

      socket.on('timer-start', (payload) => {
        console.log('TIMER START', payload)
        setInterval(() => {
          payload.time--;
          io.to(payload.roomId).emit('tick', payload.time) //REFACTOR WITH ROOM STUFF
        }, 1000)
      })

      socket.on('correctWord', (payload) => {
        console.log('SOMEONE IS RIGHT');
        io.to(payload.roomId).emit('newWord', payload); //REFACTOR WITH ROOM STUFF
      });

      socket.on("join-room", (roomId) => {
        const users = socket.adapter.rooms.get(roomId); // get list of sockets in room
        const numUsers = users ? users.size : 0; // get number of users in room
        if (numUsers < 4) {
          socket.join(roomId); // join if theres room
          console.log(`successfully joined room `, roomId);
          socket.to(roomId).emit("update-users");
          console.log(numUsers);
        } else {
          socket.broadcast.emit("room-full"); // redirect to error page if room is full.
        }
      });

      socket.on("disconnecting", () => {
        const room = Array.from(socket.rooms);
        socket.to(room[1]).emit("update-users");
      });

      socket.on("get-host", async (room) => {
        const users = Array.from(socket.adapter.rooms.get(room));
        const userHost = await io.fetchSockets(users[0]);
        const hostName = userHost[0].nickname;
        console.log("user: ", users, "userHost:", userHost);
        socket.emit("set-host", hostName);
      });

      socket.on("load-users", async (roomId) => {
        const users = await io.in(roomId).fetchSockets();
        let players = [];
        for (const socket of users) {
          const nickname = socket.nickname;
          const color = socket.color;
          const host = socket.host;
          players.push({
            nickname,
            color,
            host,
          });
        }
        socket.emit("render-users", players);
      });

      socket.on("start-session", (roomId, puzzle) => {
        console.log("starting session:", roomId, puzzle);
        socket.to(roomId).emit("begin-session", puzzle);
      });

      socket.on("end-session", (roomId) => {
        socket.to(roomId).emit("ending-session");

        //make users 'leave' room
        //clear any info from that session, including players, content, room, etc.
      });

      socket.on("guess", (payload) => {
        io.emit("crosswar", payload);
      });
    });
  } catch (ex) {
    console.log(ex);
  }
};

init();
