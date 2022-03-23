const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../script/seed');

const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () =>
      console.log(`Mixing it up on port ${PORT}`)
    );
    const io = require('socket.io')(server, {
      cors: {
        origin: '*',
      },
    });

    let player = [];

    io.on('connection', (socket) => {
      console.log(`Connection from client ${socket.id}`);

      socket.on('set-info', (userObj) => {
        socket.nickname = userObj.nickname; // this is setting these properties on the client side socket, not the server side
        socket.color = userObj.color;
        socket.host = userObj.host;
        // console.log(socket);
      });

      socket.on('join-room', (roomId) => {
        const users = socket.adapter.rooms.get(roomId); // get list of sockets in room
        const numUsers = users ? users.size : 0; // get number of users in room
        if (numUsers < 4) {
          socket.join(roomId); // join if theres room
          console.log(`successfully joined room `, roomId);
          socket.to(roomId).emit('update-users');
          console.log(numUsers);
        } else {
          socket.broadcast.emit('room-full'); // redirect to error page if room is full.
        }
      });

      socket.on('disconnecting', () => {
        const room = Array.from(socket.rooms);
        socket.to(room[1]).emit('update-users');
      });

      //from youtube tutorial:
      socket.on('join-server', (username) => {
        const user = {
          username,
          id: socket.id,
        };
        users.push(user);
        io.emit('new user', users);
      });

      //from gogh on:
      socket.on('join-room', (roomId) => {
        const users = socket.adapter.rooms.get(roomId);
        const numUsers = users ? users.size : 0;
        if (numUsers < 4) {
          socket.join(roomId);
          console.log(`successfully joined room `, roomId);
          socket.to(roomId).emit('update-users');
        } else {
          socket.broadcast.emit('room-full');
        }
      });

      // // from gogh on, for when we want customization:
      // socket.on('set-info', (userObj) => {
      //   socket.nickname = userObj.nickname;
      //   socket.avatar = userObj.avatar;
      //   socket.host = userObj.host;
      // });

      socket.on('get-host', async (room) => {
        const users = Array.from(socket.adapter.rooms.get(room));
        const userHost = await io.fetchSockets(users[0]);
        const hostName = userHost[0].nickname;
        socket.emit('set-host', hostName);
      });

      socket.on('guess', (payload) => {
        io.emit('crosswar', payload);
      });
    });
  } catch (ex) {
    console.log(ex);
  }
};

init();
