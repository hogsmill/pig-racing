const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const logFile = prod ? process.argv[4] : 'server.log'

const currentAction = ''
const currentData = ''
ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (currentAction) {
    logStr = logStr + '  Action: ' + currentAction + '\n'
  }
  if (currentData) {
    logStr = logStr + '  Data: ' + currentData + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:*', 'http://agilesimulations.co.uk'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 1000

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

io.on('connection', (socket) => {
  console.log('connection')
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
  }

  socket.on('disconnect', () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
  })

  socket.on('testVideo', (data) => { emit('testVideo', data) })

  socket.on('testVideoFrom', (data) => { emit('testVideoFrom', data) })

  socket.on('stopTest', (data) => { emit('stopTest', data) })

  socket.on('setRace', (data) => { emit('setRace', data) })

  socket.on('bet', (data) => { emit('bet', data) })

  socket.on('place', (data) => { emit('place', data) })

  socket.on('playPause', () => { emit('playPause') })

  socket.on('showPigs', () => { emit('showPigs') })

  socket.on('runRace', () => { emit('runRace') })

  socket.on('runDemoRace', () => { emit('runDemoRace') })

  socket.on('backToBetting', () => { emit('backToBetting') })

  socket.on('finish', () => { emit('finish') })
})

const port = process.argv[2] || 3010

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
