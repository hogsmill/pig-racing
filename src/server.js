const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

var debugOn = false
function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data);
}

io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}.`)

  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected.`)
  });

  socket.on("setRace", (data) => { emit("setRace", data) })

  socket.on("bet", (data) => { emit("bet", data) })

  socket.on("place", (data) => { emit("place", data) })

  socket.on("playPause", () => { emit("playPause") })

  socket.on("runRace", () => { emit("runRace") })

  socket.on("backToBetting", () => { emit("backToBetting") })

  socket.on("finish", () => { emit("finish") })
});

http.listen(3001, () => {
  console.log("Listening on *:3001");
});
