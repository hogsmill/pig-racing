const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const logFile = prod ? process.argv[4] : 'server.log'

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

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

let watching = {
  betting: {},
  racing: {}
}

function watchingVideo(data, socketId) {
  if (data.watching) {
    watching[data.field][socketId] = true
  } else {
    delete watching[data.field][socketId]
  }
  emit('watching', watching)
}

function clearWatching() {
  watching = {
    betting: {},
    racing: {}
  }
}

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  if (err) throw err
  const db = client.db('db')

  io.on('connection', (socket) => {
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

    socket.on('loadRaces', () => { dbStore.loadRaces(db, io, debugOn) })

    socket.on('testVideo', (data) => { emit('testVideo', data) })

    socket.on('testVideoFrom', (data) => { emit('testVideoFrom', data) })

    socket.on('stopTest', (data) => { emit('stopTest', data) })

    socket.on('setNextRace', (data) => { dbStore.setNextRace(db, io, data, debugOn) })

    socket.on('restart', (data) => {
      dbStore.restart(db, io, data, debugOn)
      clearWatching()
    })

    socket.on('watching', (data) => { watchingVideo(data, socket.id) })

    socket.on('bet', (data) => { dbStore.bet(db, io, data, debugOn) })

    socket.on('place', (data) => { emit('place', data) })

    socket.on('playPause', () => { emit('playPause') })

    socket.on('showPigs', (data) => { emit('showPigs', data) })

    socket.on('runRace', () => { emit('runRace') })

    socket.on('runDemoRace', () => { emit('runDemoRace') })

    socket.on('backToBetting', (data) => { dbStore.backToBetting(db, io, data, debugOn) })

    socket.on('finish', (data) => { dbStore.finish(db, io, data, debugOn) })

    socket.on('showQuizRound', (data) => { emit('showQuizRound', data) })

    socket.on('setQuizSlide', (data) => { dbStore.setQuizSlide(db, io, data, debugOn) })

    socket.on('submitAnswer', (data) => { dbStore.submitAnswer(db, io, data, debugOn) })

    socket.on('finishQuizRound', (data) => {
      emit('hideQuizRound', false)
      dbStore.finishQuizRound(db, io, data, debugOn)
    })

    // Setup
    socket.on('setGroup', (data) => { dbStore.setGroup(db, io, data, debugOn) })

    socket.on('loadGroups', () => { dbStore.loadGroups(db, io, debugOn) })

    socket.on('addGroup', (data) => { dbStore.addGroup(db, io, data, debugOn) })

    socket.on('setMaxPunters', (data) => { dbStore.setMaxPunters(db, io, data, debugOn) })

    socket.on('deleteGroup', (data) => { dbStore.deleteGroup(db, io, data, debugOn) })

    socket.on('setGroupDoublePointsOnLastRace', (data) => { dbStore.setGroupDoublePointsOnLastRace(db, io, data, debugOn) })

    socket.on('setGroupQuiz', (data) => { dbStore.setGroupQuiz(db, io, data, debugOn) })

    socket.on('setGroupCombineScores', (data) => { dbStore.setGroupCombineScores(db, io, data, debugOn) })

    socket.on('addPunter', (data) => { dbStore.addPunter(db, io, data, debugOn) })

    socket.on('toggleIncludePunter', (data) => { dbStore.toggleIncludePunter(db, io, data, debugOn) })

    socket.on('deletePunter', (data) => { dbStore.deletePunter(db, io, data, debugOn) })

    socket.on('includeRace', (data) => { dbStore.includeRace(db, io, data, debugOn) })

    socket.on('setNoOfRounds', (data) => { dbStore.setNoOfRounds(db, io, data, debugOn) })

    socket.on('loadSlides', () => { dbStore.loadSlides(db, io, debugOn) })

    socket.on('putSlideInRound', (data) => { dbStore.putSlideInRound(db, io, data, debugOn) })

    socket.on('deleteSlideFromRound', (data) => { dbStore.deleteSlideFromRound(db, io, data, debugOn) })

    socket.on('setAnswerCorrect', (data) => { dbStore.setAnswerCorrect(db, io, data, debugOn) })

    socket.on('setAsMarked', (data) => { dbStore.setAsMarked(db, io, data, debugOn) })
  })
})

const port = process.argv[2] || 3010

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
