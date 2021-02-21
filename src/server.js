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

      // Quiz
      case 'setQuizSlide':
        dbStore.setQuizSlide(db, io, data, debugOn)
        break
      case 'submitAnswer':
        dbStore.submitAnswer(db, io, data, debugOn)
        break
      case 'finishQuizRound':
        dbStore.finishQuizRound(db, io, data, debugOn)
        break

      // Set up
      case 'loadGroups':
        dbStore.loadGroups(db, io, data, debugOn)
        break
      case 'addGroup':
        dbStore.addGroup(db, io, data, debugOn)
        break
      case 'setMaxPunters':
        dbStore.setMaxPunters(db, io, data, debugOn)
        break
      case 'deleteGroup':
        dbStore.deleteGroup(db, io, data, debugOn)
        break
      case 'setGroupDoublePointsOnLastRace':
        dbStore.setGroupDoublePointsOnLastRace(db, io, data, debugOn)
        break
      case 'setGroupQuiz':
        dbStore.setGroupQuiz(db, io, data, debugOn)
        break
      case 'setGroupCombineScores':
        dbStore.setGroupCombineScores(db, io, data, debugOn)
        break
      case 'addPunter':
        dbStore.addPunter(db, io, data, debugOn)
        break
      case 'deletePunter':
        dbStore.deletePunter(db, io, data, debugOn)
        break
      case 'toggleIncludePunter':
        dbStore.toggleIncludePunter(db, io, data, debugOn)
        break
      case 'includeRace':
        dbStore.includeRace(db, io, data, debugOn)
        break
      case 'loadSlides':
        dbStore.loadSlides(db, io, data, debugOn)
        break
      case 'setNoOfRounds':
       dbStore.setNoOfRounds(db, io, data, debugOn)
        break
      case 'putSlideInRound':
        dbStore.putSlideInRound(db, io, data, debugOn)
        break
      case 'deleteSlideFromRound':
        dbStore.deleteSlideFromRound(db, io, data, debugOn)
        break
      case 'setAnswerCorrect':
        dbStore.setAnswerCorrect(db, io, data, debugOn)
        break
      case 'setAsMarked':
        dbStore.setAsMarked(db, io, data, debugOn)
        break
      default:
        console.log('Unknown function "' + fun + '"')
    }
  })
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

  socket.on('loadRaces', () => { doDb('loadRaces') })

  socket.on('getGroup', (data) => { doDb('getGroup', data) })

  socket.on('testVideo', (data) => { emit('testVideo', data) })

  socket.on('testVideoFrom', (data) => { emit('testVideoFrom', data) })

  socket.on('stopTest', (data) => { emit('stopTest', data) })

  socket.on('setNextRace', (data) => { doDb('setNextRace', data) })

  socket.on('restart', (data) => {
    doDb('restart', data)
    clearWatching()
  })

  socket.on('watching', (data) => { watchingVideo(data, socket.id) })

  socket.on('bet', (data) => { doDb('bet', data) })

  socket.on('place', (data) => { emit('place', data) })

  socket.on('playPause', () => { emit('playPause') })

  socket.on('showPigs', (data) => { emit('showPigs', data) })

  socket.on('runRace', () => { emit('runRace') })

  socket.on('runDemoRace', () => { emit('runDemoRace') })

  socket.on('backToBetting', (data) => { doDb('backToBetting', data) })

  socket.on('finish', (data) => { doDb('finish', data) })

  socket.on('showQuizRound', (data) => { emit('showQuizRound', data) })

  socket.on('setQuizSlide', (data) => { doDb('setQuizSlide', data) })

  socket.on('submitAnswer', (data) => { doDb('submitAnswer', data) })

  socket.on('finishQuizRound', (data) => {
    emit('hideQuizRound', false)
    doDb('finishQuizRound', data)
  })

  // Setup
  socket.on('setGroup', (data) => { doDb('setGroup', data) })

  socket.on('loadGroups', () => { doDb('loadGroups') })

  socket.on('addGroup', (data) => { doDb('addGroup', data) })

  socket.on('setMaxPunters', (data) => { doDb('setMaxPunters', data) })

  socket.on('deleteGroup', (data) => { doDb('deleteGroup', data) })

  socket.on('setGroupDoublePointsOnLastRace', (data) => { doDb('setGroupDoublePointsOnLastRace', data) })

  socket.on('setGroupQuiz', (data) => { doDb('setGroupQuiz', data) })

  socket.on('setGroupCombineScores', (data) => { doDb('setGroupCombineScores', data) })

  socket.on('addPunter', (data) => { doDb('addPunter', data) })

  socket.on('toggleIncludePunter', (data) => { doDb('toggleIncludePunter', data) })

  socket.on('deletePunter', (data) => { doDb('deletePunter', data) })

  socket.on('includeRace', (data) => { doDb('includeRace', data) })

  socket.on('setNoOfRounds', (data) => { doDb('setNoOfRounds', data) })

  socket.on('loadSlides', () => { doDb('loadSlides') })

  socket.on('putSlideInRound', (data) => { doDb('putSlideInRound', data) })

  socket.on('deleteSlideFromRound', (data) => { doDb('deleteSlideFromRound', data) })

  socket.on('setAnswerCorrect', (data) => { doDb('setAnswerCorrect', data) })

  socket.on('setAsMarked', (data) => { doDb('setAsMarked', data) })
})

const port = process.argv[2] || 3010

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
