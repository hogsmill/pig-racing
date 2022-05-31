<template>
  <div id="app" class="mb-4">
    <appHeader />
    <h1>
      Pig Racing
      <span v-if="isHost">(Host<span v-if="currentGroup.id"> - {{ currentGroup.group }}</span>)</span>
      <span v-if="demo">(Demo)</span>
    </h1>
    <div v-if="currentTab == 'setup'">
      <SetUp />
    </div>
    <div v-if="currentTab == 'racing'">
      <div v-if="isHost" :class="{hidden : running }" class="current-race">
        <button class="btn btn-warning btn-sm" @click="testVideo()">
          Test Play Video
        </button>
        <button class="btn btn-warning btn-sm" @click="testVideoFrom()">
          Test Play Video From
        </button>
        <button class="btn btn-primary btn-sm" @click="nextRace()">
          Next Race
        </button>
        <button class="btn btn-primary btn-sm" v-if="!quiz" @click="showQuizRound()">
          Next Quiz Round
        </button>
        <button class="btn btn-primary btn-sm" v-if="quiz" @click="finishQuizRound()">
          Finish Quiz Round
        </button>
        <button class="btn btn-primary btn-sm" @click="restart()">
          Restart
        </button>
      </div>
      <div v-if="demo && running" class="controls">
        <span>
          Click
          <button class="btn btn-primary btn-sm" @click="finishDemoBetting()">
            Finish
          </button>
          to go back to the explanation
        </span>
        <span>
          Click
          <button class="btn btn-primary btn-sm" @click="finishDemoRace()">
            Finish
          </button>
          to finish watching the race
        </span>
      </div>

      <Players v-if="!demo" />

      <div v-if="isHost && !quiz">
        Watching Betting: {{ Object.keys(watching.betting).length }},
        Watching Racing: {{ Object.keys(watching.racing).length }}
      </div>

      <div v-if="!quiz" class="container">
        <div :class="{hidden : !running }" class="video">
          <div v-if="isHost" class="controls">
            <button class="btn btn-warning btn-sm" @click="stopTest()">
              Stop Test
            </button>
            <button class="btn btn-primary btn-sm" @click="playPause()" v-if="!playing">
              Play
            </button>
            <button class="btn btn-primary btn-sm" @click="playPause()" v-if="playing">
              Pause
            </button>
            <button class="btn btn-primary btn-sm" :disabled="!watchingBetting" @click="backToBetting()">
              Back to Betting
            </button>
            <button class="btn btn-primary btn-sm" :disabled="watchingBetting" @click="finish()">
              Finish
            </button>
          </div>
          <video id="video" width="70%"><source src="" type="video/mp4"></video>
        </div>

        <div :class="{hidden : running }" class="card-deck">
          <Races />
          <Winnings v-if="!demo" />
        </div>

        <Demo v-if="demo" />
      </div>

      <Quiz v-if="quiz" />
    </div>
    <Modals />
  </div>
</template>

<script>
import bus from './socket.js'

import params from './lib/params.js'
import video from './lib/video.js'

import appHeader from './components/Header.vue'
import SetUp from './components/SetUp.vue'
import Players from './components/Players.vue'
import Races from './components/Races.vue'
import Winnings from './components/Winnings.vue'
import Quiz from './components/Quiz.vue'
import Demo from './components/Demo.vue'
import Modals from './components/Modals.vue'

export default {
  name: 'App',
  components: {
    appHeader,
    SetUp,
    Players,
    Races,
    Winnings,
    Quiz,
    Demo,
    Modals
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    demo() {
      return this.$store.getters.getDemo
    },
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    },
    demoRaceFinished() {
      return this.$store.getters.getDemoRaceFinished
    },
    watching() {
      return this.$store.getters.getWatching
    },
    watchingBetting() {
      return this.$store.getters.getWatchingBetting
    },
    currentRace() {
      return this.$store.getters.getCurrentRace
    },
    running() {
      return this.$store.getters.getRunning
    },
    quiz() {
      return this.$store.getters.getQuiz
    },
    playing() {
      return this.$store.getters.getPlaying
    },
    races() {
      return this.$store.getters.getRaces
    },
    punters() {
      return this.$store.getters.getPunters
    }
  },
  created() {
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.isParam('demo')) {
      this.$store.dispatch('updateDemo', true)
    }

    const self = this
    window.onload = function() {
      for (let i = 1; i <= 3; i++) {
        let player = localStorage.getItem('pr-player-' + i)
        if (player) {
          player = JSON.parse(player)
          self.$store.dispatch('updatePlayer' + i, player)
        } else {
          self.$store.dispatch('updatePlayer' + i, {})
        }
      }
    }

    bus.on('loadRaces', (data) => {
      this.$store.dispatch('updateRaces', data)
    })

    bus.on('loadGroups', (data) => {
      this.$store.dispatch('updateGroups', data)
    })

    bus.on('showQuizRound', () => {
      this.$store.dispatch('showQuizRound', true)
    })

    bus.on('hideQuizRound', () => {
      this.$store.dispatch('showQuizRound', false)
    })

    bus.on('setQuizSlide', (data) => {
      this.$store.dispatch('setQuizSlide', data)
    })

    bus.on('backToBetting', () => {
      this.$store.dispatch('updateWatchingBetting', false)
      this.$store.dispatch('updateRunning', false)
    })

    bus.on('watching', (data) => {
      this.$store.dispatch('updateWatching', data)
    })

    bus.on('loadSlides', (data) => {
      this.$store.dispatch('updateSlides', data)
    })

    bus.emit('sendLoadRaces')
    bus.emit('sendLoadGroups')
  },
  mounted() {
    bus.on('testVideo', () => {
      this._testVideo()
    })
    bus.on('testVideoFrom', () => {
      this._testVideoFrom()
    })
    bus.on('stopTest', () => {
      this._stopTest()
    })

    bus.on('playPause', () => {
      const video = document.getElementById('video')
      if (video.paused) {
        video.play()
        this.$store.dispatch('updatePlaying', true)
      } else {
        video.pause()
        this.$store.dispatch('updatePlaying', false)
      }
    })

    const self = this
    document.getElementById('video').onended = function() {
      bus.emit('sendWatching', {groupId: self.currentGroup.id, field: 'racing', watching: false})
    }
  },
  methods: {
    playPause() {
      bus.emit('sendPlayPause')
    },
    testVideo() {
      bus.emit('sendTestVideo')
    },
    testVideoFrom() {
      bus.emit('sendTestVideoFrom')
    },
    stopTest() {
      bus.emit('sendStopTest')
    },
    _testVideo() {
      document.getElementById('video').controls = true
      video.setTestVideo()
      this.$store.dispatch('updateRunning', true)
    },
    _testVideoFrom() {
      video.setVideoTime(30)
      video.playVideo()
      this.$store.dispatch('updateRunning', true)
    },
    _stopTest() {
      document.getElementById('video').controls = false
      video.pauseVideo()
      this.$store.dispatch('updateRunning', false)
    },
    nextRace() {
      bus.emit('sendSetNextRace', {groupId: this.currentGroup.id})
    },
    showQuizRound() {
      bus.emit('sendShowQuizRound', {groupId: this.currentGroup.id})
    },
    finishQuizRound() {
    bus.emit('sendFinishQuizRound', {groupId: this.currentGroup.id})
    },
    restart() {
      bus.emit('sendRestart', {groupId: this.currentGroup.id})
    },
    backToBetting() {
      bus.emit('sendBackToBetting', {groupId: this.currentGroup.id})
    },
    finish() {
      bus.emit('sendFinish', {groupId: this.currentGroup.id})
    },
    finishDemoBetting() {
      this.$store.dispatch('updateDemoBetting', false)
    },
    finishDemoRace() {
      this.$store.dispatch('updateDemoRaceFinished', true)
    }
  }
}
</script>

<style lang="scss">

  div { vertical-align: top; }

  .hidden { visibility: hidden; height: 0; }

  .current-race { padding: 6px; }
  .races { width: 48%; display: inline-block; }
  .race { padding-bottom: 6px; }
  .race-name { position: relative; text-align: left; padding: 10px; background-color: #bbb; color: #fff; }
  .race-name-name { font-weight: bold; width: 20%; display: inline; }
  .race table { width: 100%; }
  .bet-header { width: 150px; }
  .run-race { position: relative; top: -7px; }
  .current { margin-bottom: 2px; }
  .places { text-align: right; float: right; width: 78%; }
  .places span { vertical-align: middle; display: inline; margin: 2px;  }
  .places img { width: 20px; }

  .winnings { width: 48%; display: inline-block; margin-right: 0; }
  .avatar { width: 20px; height: 20px; margin-right: 2px; }

  .video { vertical-align: middle; }
  #video { width: 100%; max-height: 700px;}

</style>
