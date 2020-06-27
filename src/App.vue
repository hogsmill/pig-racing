<template>
  <div id="app" class="mb-4">
    <h1>Pig Racing</h1>
    <div v-if="host" :class="{hidden : running }" class="current-race">
      <button class="btn btn-warning btn-sm" @click="testVideo()">Test Play Video</button>
      <button class="btn btn-warning btn-sm" @click="testVideoFrom()">Test Play Video From</button>
      <button class="btn btn-primary btn-sm" @click="nextRace()">Next Race</button>
    </div>

    <Players />

    <div class="container">
      <div :class="{hidden : !running }" class="video">
        <div v-if="host" class="controls">
          <button class="btn btn-warning btn-sm" @click="stopTest()">Stop Test</button>
          <button class="btn btn-primary btn-sm" @click="playPause()" v-if="!playing">Play</button>
          <button class="btn btn-primary btn-sm" @click="playPause()" v-if="playing">Pause</button>
          <button class="btn btn-primary btn-sm" @click="backToBetting()">Back to Betting</button>
          <button class="btn btn-primary btn-sm" @click="finish()">Finish</button>
        </div>
        <video id="video" width="70%" controls><source src="" type="video/mp4"></video>
      </div>

      <div :class="{hidden : running }" class="card-deck">
        <Races />
        <Winnings />
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

import video from './behaviour/video.js'

import Players from "./components/Players.vue";
import Races from "./components/Races.vue";
import Winnings from "./components/Winnings.vue";

export default {
  name: 'App',
  components: {
    Players,
    Races,
    Winnings
  },
  data() {
    return {
      name1: '',
      name2: ''
    }
  },
  methods: {
    playPause: function() {
      this.socket.emit("playPause")
    },
    testVideo: function() {
      this.socket.emit("testVideo")
    },
    testVideoFrom: function() {
      this.socket.emit("testVideoFrom")
    },
    stopTest: function() {
      this.socket.emit("stopTest")
    },
    _testVideo: function() {
      video.setTestVideo()
      this.$store.dispatch("updateRunning", true)
    },
    _testVideoFrom: function() {
      video.setVideoTime(30)
      video.playVideo()
      this.$store.dispatch("updateRunning", true)
    },
    _stopTest: function() {
      video.pauseVideo()
      this.$store.dispatch("updateRunning", false)
    },
    nextRace: function() {
      var currentRace
      if (this.currentRace < this.races.length - 1) {
        currentRace = this.currentRace + 1
      } else {
        currentRace = -1
      }
      this.$store.dispatch("updateCurrentRace", currentRace)
      this.socket.emit("setRace", { race: currentRace })
    },
    backToBetting: function() {
      this.socket.emit("backToBetting", {})
      this.$store.dispatch("updatePigsHaveBeenShown", this.currentRace)
    },
    finish: function() {
      this.socket.emit("finish", {})
    }
  },
  computed: {
    host() {
      return this.$store.getters.getHost;
    },
    currentRace() {
      return this.$store.getters.getCurrentRace;
    },
    running() {
      return this.$store.getters.getRunning;
    },
    playing() {
      return this.$store.getters.getPlaying;
    },
    races() {
      return this.$store.getters.getRaces;
    },
    punters() {
      return this.$store.getters.getPunters;
    }
  },
  created() {
    var host = "77.68.122.69"
      if (location.hostname == 'localhost') {
        host = 'localhost'
      }
      var connStr = "http://" + host + ":3010"
      console.log("Connecting to: " + connStr)
      this.socket = io(connStr)
  },
  mounted() {
    if (location.search == "?host") {
      this.$store.dispatch("updateHost", true)
    }

    this.socket.on("testVideo", () => {
      this._testVideo()
    })
    this.socket.on("testVideoFrom", () => {
      this._testVideoFrom()
    })
    this.socket.on("stopTest", () => {
      this._stopTest()
    })

    this.socket.on("setRace", (data) => {
      this.$store.dispatch("updateCurrentRace", data['race'])
    })
    this.socket.on("playPause", () => {
      var video = document.getElementById("video")
      if (video.paused) {
        video.play()
        this.$store.dispatch("updatePlaying", true)
      } else {
        video.pause()
        this.$store.dispatch("updatePlaying", false)
      }
    })
  }
}
</script>

<style>

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
  .gold { border-radius: 6px; color: #fff; background-color: goldenrod; }
  .silver { border-radius: 6px; color: #fff; background-color: silver; }
  .bronze { border-radius: 6px; color: #fff; background-color: saddlebrown; }
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
