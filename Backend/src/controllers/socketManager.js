import { Server } from "socket.io";

let connection = {};
let message = {};
let timeOnline = {};

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("join-call", (path) => {

        socket.join(path);
        
      if (connection[path] === undefined) {
        connection[path] = [];
      }

      connection[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      // Notify all clients in this room about the new user
      io.to(path).emit("user-joined", socket.id, connection[path]);

      if (message[path]) {
        for (let a = 0; a < connection[path].length; a++) {
          io.to(connection[path][a]).emit(
            "chat-message",
            message[path][a]["data"],
            message[path][a]["sender"],
            message[path][a]["socket-id-sender"],
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [machingRoom, found] = Object.entries(connection).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false],
      );

      if (found === true) {
        if (message[machingRoom] === undefined) {
          message[machingRoom] = [];
        }

        message[machingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        connection[machingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      let diffTime = Math.abs(timeOnline[socket.id] - new Date());

      let key;

      for (const [k, value] of JSON.parse(
        JSON.stringify(Object.entries(connection)),
      )) {
        for (let a = 0; a < value.length; a++) {
          if (value[a] === socket.id) {
            key = k;

            for (let a = 0; a < connection[key].length; a++) {
              io.to(connection[key][a]).emit("user-left", socket.id);
            }

            let index = connection[key].indexOf(socket.id);

            connection[key].splice(index, 1);

            if (connection[key].length == 0) {
              delete connection[key];
            }
          }
        }
      }
    });
  });

  return io;
};

export { connectToSocket };
