const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}.`);

  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected.`);
  });

  socket.on("setRace", (data) => {
    console.log("setRace: ", data);
    io.emit("setRace", data);
  });

  socket.on("bet", (data) => {
    console.log("bet: ", data);
    io.emit("bet", data);
  });

  socket.on("place", (data) => {
    console.log("place: ", data);
    io.emit("place", data);
  });

  socket.on("runRace", () => {
    console.log("runRace: ");
    io.emit("runRace");
  });

  socket.on("backToBetting", () => {
    console.log("backToBetting: ");
    io.emit("backToBetting");
  });

  socket.on("finish", () => {
    console.log("finish: ");
    io.emit("finish");
  });
});

http.listen(3001, () => {
  console.log("Listening on *:3001");
});
