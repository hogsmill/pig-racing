import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3010'
} else {
  connStr = 'https://agilesimulations.co.uk:3010'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Send

bus.$on('sendLoadRaces', () => { socket.emit('sendLoadRaces') })

bus.$on('sendLoadGroups', () => { socket.emit('sendLoadGroups') })

bus.$on('sendWatching', (data) => { socket.emit('sendWatching', data) })

bus.$on('sendPlayPause', () => { socket.emit('sendPlayPause') })

bus.$on('sendTestVideo', () => { socket.emit('sendTestVideo') })

bus.$on('sendTestVideoFrom', () => { socket.emit('sendTestVideoFrom') })

bus.$on('sendStopTest', () => { socket.emit('sendStopTest') })

bus.$on('sendSetNextRace', (data) => { socket.emit('sendSetNextRace', data) })

bus.$on('sendShowQuizRound', (data) => { socket.emit('sendShowQuizRound', data) })

bus.$on('sendFinishQuizRound', (data) => { socket.emit('sendFinishQuizRound', data) })

bus.$on('sendRestart', (data) => { socket.emit('sendRestart', data) })

bus.$on('sendBackToBetting', (data) => { socket.emit('sendBackToBetting', data) })

bus.$on('sendBet', (data) => { socket.emit('sendBet', data) })

bus.$on('sendRunRace', (data) => { socket.emit('sendRunRace', data) })

bus.$on('sendFinish', (data) => { socket.emit('sendFinish', data) })

bus.$on('sendShowPigs', (data) => { socket.emit('sendShowPigs', data) })

bus.$on('sendSetQuizSlide', (data) => { socket.emit('sendSetQuizSlide', data) })

bus.$on('sendSubmitAnswer', (data) => { socket.emit('sendSubmitAnswer', data) })

bus.$on('sendSetAnswerCorrect', (data) => { socket.emit('sendSetAnswerCorrect', data) })

bus.$on('sendAddGroup', (data) => { socket.emit('sendAddGroup', data) })

bus.$on('sendSetGroup', (data) => { socket.emit('sendSetGroup', data) })

bus.$on('sendSetGroupDoublePointsOnLastRace', (data) => { socket.emit('sendSetGroupDoublePointsOnLastRace', data) })

bus.$on('sendSetGroupQuiz', (data) => { socket.emit('sendSetGroupQuiz', data) })

bus.$on('sendSetGroupCombineScores', (data) => { socket.emit('sendSetGroupCombineScores', data) })

bus.$on('sendDeleteGroup', (data) => { socket.emit('sendDeleteGroup', data) })

bus.$on('sendAddPunter', (data) => { socket.emit('sendAddPunter', data) })

bus.$on('sendSetMaxPunters', (data) => { socket.emit('sendSetMaxPunters', data) })

bus.$on('sendDeletePunter', (data) => { socket.emit('sendDeletePunter', data) })

bus.$on('sendToggleIncludePunter', (data) => { socket.emit('sendToggleIncludePunter', data) })

bus.$on('sendLoadSlides', () => { socket.emit('sendLoadSlides') })

bus.$on('sendSetNoOfRounds', (data) => { socket.emit('sendSetNoOfRounds', data) })

bus.$on('sendPutSlideInRound', (data) => { socket.emit('sendPutSlideInRound', data) })

bus.$on('sendDeleteSlideFromRound', (data) => { socket.emit('sendDeleteSlideFromRound', data) })

bus.$on('sendIncludeRace', (data) => { socket.emit('sendIncludeRace', data) })

// Receive

socket.on('loadRaces', (data) => { bus.$emit('loadRaces', data) })

socket.on('loadGroups', (data) => { bus.$emit('loadGroups', data) })

socket.on('showPigs', (data) => { bus.$emit('showPigs', data) })

socket.on('runRace', (data) => { bus.$emit('runRace', data) })

socket.on('showQuizRound', (data) => { bus.$emit('showQuizRound', data) })

socket.on('hideQuizRound', (data) => { bus.$emit('hideQuizRound', data) })

socket.on('setQuizSlide', (data) => { bus.$emit('setQuizSlide', data) })

socket.on('backToBetting', (data) => { bus.$emit('backToBetting', data) })

socket.on('watching', (data) => { bus.$emit('watching', data) })

socket.on('loadSlides', (data) => { bus.$emit('loadSlides', data) })

socket.on('testVideo', () => { bus.$emit('testVideo') })

socket.on('testVideoFrom', () => { bus.$emit('testVideoFrom') })

socket.on('stopTest', () => { bus.$emit('stopTest') })

socket.on('playPause', () => { bus.$emit('playPause') })

socket.on('finish', () => { bus.$emit('finish') })

socket.on('place', () => { bus.$emit('place') })

socket.on('runDemoRace', () => { bus.$emit('runDemoRace') })


export default bus
