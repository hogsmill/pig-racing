const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var prod = os.hostname() == "agilesimulations" ? true : false

var connectDebugOff = prod
var debugOn = !prod

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

io.on("connection", (socket) => {
  connectDebugOff || console.log(`A user connected with socket id ${socket.id}.`)

  socket.on("disconnect", () => {
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
  })
  
  socket.on("setRace", (data) => { emit("setRace", data) })

  socket.on("bet", (data) => { emit("bet", data) })

  socket.on("place", (data) => { emit("place", data) })

  socket.on("playPause", () => { emit("playPause") })

  socket.on("runRace", () => { emit("runRace") })

  socket.on("backToBetting", () => { emit("backToBetting") })

  socket.on("finish", () => { emit("finish") })
});

var port = process.argv[2] || 3010

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
