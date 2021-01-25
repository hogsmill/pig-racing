<template>
  <div id="app" class="mb-4">
    <Header />
    <h1>
      Pig Racing
      <span v-if="isHost">(Host)</span>
      <span v-if="demo">(Demo)</span>
    </h1>
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
    </div>
    <div v-if="demo && running" class="controls">
      Click
      <button class="btn btn-primary btn-sm" @click="finishDemoRace()">
        Finish
      </button>
      to go back to the explanation
    </div>

    <Players v-if="!demo" />

    <div v-if="isHost">
      Watching Betting: {{ watchingBetting }}
    </div>

    <div class="container">
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
          <button class="btn btn-primary btn-sm" @click="backToBetting()">
            Back to Betting
          </button>
          <button class="btn btn-primary btn-sm" @click="finish()">
            Finish
          </button>
        </div>
        <video id="video" width="70%" controls><source src="" type="video/mp4"></video>
      </div>

      <div :class="{hidden : running }" class="card-deck">
        <Races :socket="socket" />
        <Winnings v-if="!demo" />
      </div>

      <Demo v-if="demo" :socket="socket" />
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import params from './lib/params.js'
import video from './lib/video.js'

import Header from './components/Header.vue'
import Players from './components/Players.vue'
import Races from './components/Races.vue'
import Winnings from './components/Winnings.vue'
import Demo from './components/Demo.vue'

export default {
  name: 'App',
  components: {
    Header,
    Players,
    Races,
    Winnings,
    Demo
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    demo() {
      return this.$store.getters.getDemo
    },
    demoRaceFinished() {
      return this.$store.getters.getDemoRaceFinished
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
    let host = '77.68.122.69'
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    const connStr = 'http://' + host + ':3010'
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.isParam('demo')) {
      this.$store.dispatch('updateDemo', true)
    }
  },
  mounted() {
    this.socket.on('testVideo', () => {
      this._testVideo()
    })
    this.socket.on('testVideoFrom', () => {
      this._testVideoFrom()
    })
    this.socket.on('stopTest', () => {
      this._stopTest()
    })

    this.socket.on('setRace', (data) => {
      this.$store.dispatch('updateCurrentRace', data['race'])
    })
    this.socket.on('playPause', () => {
      const video = document.getElementById('video')
      if (video.paused) {
        video.play()
        this.$store.dispatch('updatePlaying', true)
      } else {
        video.pause()
        this.$store.dispatch('updatePlaying', false)
      }
    })
  },
  methods: {
    playPause: function() {
      this.socket.emit('playPause')
    },
    testVideo: function() {
      this.socket.emit('testVideo')
    },
    testVideoFrom: function() {
      this.socket.emit('testVideoFrom')
    },
    stopTest: function() {
      this.socket.emit('stopTest')
    },
    _testVideo: function() {
      video.setTestVideo()
      this.$store.dispatch('updateRunning', true)
    },
    _testVideoFrom: function() {
      video.setVideoTime(30)
      video.playVideo()
      this.$store.dispatch('updateRunning', true)
    },
    _stopTest: function() {
      video.pauseVideo()
      this.$store.dispatch('updateRunning', false)
    },
    nextRace: function() {
      let currentRace
      if (this.currentRace < this.races.length - 1) {
        currentRace = this.currentRace + 1
      } else {
        currentRace = -1
      }
      this.$store.dispatch('updateCurrentRace', currentRace)
      this.socket.emit('setRace', { race: currentRace })
    },
    backToBetting: function() {
      this.socket.emit('backToBetting', {})
      this.$store.dispatch('updatePigsHaveBeenShown', this.currentRace)
    },
    finish: function() {
      this.socket.emit('finish', {})
    },
    finishDemoRace() {
      this.socket.emit('finish', {})
      this.$store.dispatch('updateDemoRaceFinished', true)

    }
  }
}
</script>

<style lang="scss">

  .socket { background-color: yellow; }

  div { vertical-align: top; }

  .hidden { visibility: hidden; height: 0; }

  .current-race { padding: 6px; }
  .races { width: 48%; display: inline-block; }
  .race { padding-bottom: 6px; }
  .race-name { position: relative; text-align: left; padding: 0.5em; background-color: #bbb; color: #fff; }
  .race-name-name { font-weight: bold; width: 20%; display: inline; }
  .race table { width: 100%; }
  .bet-header { width: 150px; }
  .run-race { position: relative; top: -5px; }
  .current { margin-bottom: 2px; }
  .places { text-align: right; position: absolute; right: 6px; top: 8px; width: 78%; display: inline; }
  .places span { vertical-align: middle; display: inline; margin: 2px;  }
  .places img { width: 20px; }

  .winnings { width: 48%; display: inline-block; margin-right: 0; }
  .punter { width: 15%; display: inline-block; margin: 6px 0; }
  .avatar { width: 20px; height: 20px; margin-right: 2px; }
  .punter-span { margin-right: 6px; }
  .punter-winnings { width: 80%; display: inline-block; margin: 6px 0; }
  .total { background-color: green; color: #fff; }

  .video { vertical-align: middle; }

</style>
