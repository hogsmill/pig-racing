const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const logFile = prod ? process.argv[4] : 'server.log'

let currentAction = ''
let currentData = ''
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

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 1000

function emit(event, data) {
  if (debugOn) {
    console.log(event, data, '(emit)')
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  currentAction = fun
  currentData = data
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'loadRaces':
        dbStore.loadRaces(db, io, data, debugOn)
        break
      case 'setGroup':
        dbStore.setGroup(db, io, data, debugOn)
        break
      case 'setNextRace':
        dbStore.setNextRace(db, io, data, debugOn)
        break
      case 'restart':
        dbStore.restart(db, io, data, debugOn)
        break
      case 'backToBetting':
        dbStore.backToBetting(db, io, data, debugOn)
        break
      case 'finish':
        dbStore.finish(db, io, data, debugOn)
        break
      case 'bet':
        dbStore.bet(db, io, data, debugOn)
        break

      // Set up
      case 'loadGroups':
        dbStore.loadGroups(db, io, data, debugOn)
        break
      case 'addGroup':
        dbStore.addGroup(db, io, data, debugOn)
        break
      case 'deleteGroup':
        dbStore.deleteGroup(db, io, data, debugOn)
        break
      case 'addPunter':
        dbStore.addPunter(db, io, data, debugOn)
        break
      case 'deletePunter':
        dbStore.deletePunter(db, io, data, debugOn)
        break
      case 'includeRace':
        dbStore.includeRace(db, io, data, debugOn)
        break

      default:
        console.log('Unknown function "' + fun + '"')
    }
  })
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

  socket.on('loadRaces', () => { doDb('loadRaces') })

  socket.on('getGroup', (data) => { doDb('getGroup', data) })

  socket.on('testVideo', (data) => { emit('testVideo', data) })

  socket.on('testVideoFrom', (data) => { emit('testVideoFrom', data) })

  socket.on('stopTest', (data) => { emit('stopTest', data) })

  socket.on('setNextRace', (data) => { doDb('setNextRace', data) })

  socket.on('restart', (data) => { doDb('restart', data) })

  socket.on('bet', (data) => { doDb('bet', data) })

  socket.on('place', (data) => { emit('place', data) })

  socket.on('playPause', () => { emit('playPause') })

  socket.on('showPigs', () => { emit('showPigs') })

  socket.on('runRace', () => { emit('runRace') })

  socket.on('runDemoRace', () => { emit('runDemoRace') })

  socket.on('backToBetting', (data) => { doDb('backToBetting', data) })

  socket.on('finish', (data) => { doDb('finish', data) })

  //socket.on('finish', () => { emit('finish') })

  // Setup
  socket.on('setGroup', (data) => { doDb('setGroup', data) })

  socket.on('loadGroups', () => { doDb('loadGroups') })

  socket.on('addGroup', (data) => { doDb('addGroup', data) })

  socket.on('deleteGroup', (data) => { doDb('deleteGroup', data) })

  socket.on('addPunter', (data) => { doDb('addPunter', data) })

  socket.on('deletePunter', (data) => { doDb('deletePunter', data) })

  socket.on('includeRace', (data) => { doDb('includeRace', data) })
})

const port = process.argv[2] || 3010

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
