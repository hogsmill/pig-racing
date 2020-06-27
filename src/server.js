const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var prod = os.hostname() == "agilesimulations" ? true : false

var connectDebugOff = prod
var debugOn = true // !prod

var connections = 0
var maxConnections = 100

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

io.on("connection", (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
  }

  socket.on("disconnect", () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
  })

  socket.on("testVideo", (data) => { emit("testVideo", data) })

  socket.on("testVideoFrom", (data) => { emit("testVideoFrom", data) })

  socket.on("stopTest", (data) => { emit("stopTest", data) })

  socket.on("setRace", (data) => { emit("setRace", data) })

  socket.on("bet", (data) => { emit("bet", data) })

  socket.on("place", (data) => { emit("place", data) })

  socket.on("playPause", () => { emit("playPause") })

  socket.on("showPigs", () => { emit("showPigs") })

  socket.on("runRace", () => { emit("runRace") })

  socket.on("backToBetting", () => { emit("backToBetting") })

  socket.on("finish", () => { emit("finish") })
});

var port = process.argv[2] || 3010

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
