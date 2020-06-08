<template>
  <div id="app" class="mb-4">
    <h1>Pig Racing</h1>
    <div :class="{hidden : running }" class="current-race">
      <button class="btn btn-primary btn-sm" @click="nextRace()">Next Race</button>
    </div>
    <div class="container">
      <div :class="{hidden : !running }" class="video">
        <div class="controls">
        <button class="btn btn-primary btn-sm" @click="playPause()" v-if="!playing">Play</button>
        <button class="btn btn-primary btn-sm" @click="playPause()" v-if="playing">Pause</button>
        <button class="btn btn-primary btn-sm" @click="backToBetting()">Back to Betting</button>
        <button class="btn btn-primary btn-sm" @click="finish()">Finish</button>
        </div>
        <video id="video-0" v-if="currentRace == 0" width="50%" controls><source src="./video/VTS_01_1.mp4" type="video/mp4"></video>
        <video id="video-1" v-if="currentRace == 1" width="50%" controls><source src="./video/VTS_02_1.mp4" type="video/mp4"></video>
        <video id="video-2" v-if="currentRace == 2" width="50%" controls><source src="./video/VTS_03_1.mp4" type="video/mp4"></video>
        <video id="video-3" v-if="currentRace == 3" width="50%" controls><source src="./video/VTS_04_1.mp4" type="video/mp4"></video>
        <video id="video-4" v-if="currentRace == 4" width="50%" controls><source src="./video/VTS_05_1.mp4" type="video/mp4"></video>
        <video id="video-5" v-if="currentRace == 5" width="50%" controls><source src="./video/VTS_06_1.mp4" type="video/mp4"></video>
        <video id="video-6" v-if="currentRace == 6" width="50%" controls><source src="./video/Race SEVEN.mp4" type="video/mp4"></video>
        <video id="video-7" v-if="currentRace == 7" width="50%" controls><source src="./video/Race EIGHT.mp4" type="video/mp4"></video>
        <video id="video-8" v-if="currentRace == 8" width="50%" controls><source src="./video/Race NINE.mp4" type="video/mp4"></video>
        <video id="video-9" v-if="currentRace == 9" width="50%" controls><source src="./video/Race TEN.mp4" type="video/mp4"></video>
      </div>
      <div :class="{hidden : running }" class="card-deck">
        <div class="races card-body bg-light mb-6 col-md-6 no-padding-r-l">
          <div v-for="(race, raceIndex) in races" :key="raceIndex">
            <div class="race" :class="{ current : currentRace == raceIndex }">
              <div class="race-name">
                <div class="race-name-name">{{race['name']}}</div>
                <div v-if="currentRace == raceIndex && !race['hasRun']" class="places">
                  <button class="btn btn-primary btn-sm run-race" @click="runRace(race)">Run Race</button>
                </div>
                <div v-if="race['hasRun']" class="places">
                  <span class="place"><img src="../src/assets/img/1st.png" /> {{getPlace(race, 1)}}</span>
                  <span class="place"><img src="../src/assets/img/2nd.png" /> {{getPlace(race, 2)}}</span>
                  <span class="place"><img src="../src/assets/img/3rd.png" /> {{getPlace(race, 3)}}</span>
                </div>
              </div>
              <table v-if="raceIndex == currentRace">
                <tr>
                  <td colspan="6"></td>
                  <td colspan="3">Places</td>
                  <td></td>
                  <td colspan="6"><div class="bet-header">Bets</div></td>
                </tr>
                <tr v-for="(pig, pigIndex) in race['pigs']" :key="pigIndex">
                  <td v-for="(pigPunter, pigPunterIndex) in punters" :key="pigPunterIndex">
                    <img @click="betOn(pig, pigPunter)" v-bind:src="getAvatar(pigPunter['name'])" class="avatar" />
                  </td>
                  <td :class="{ gold: pig['place'] == 1 }" @click="place(race, pig, 1)">1</td>
                  <td :class="{ silver: pig['place'] == 2 }" @click="place(race, pig, 2)">2</td>
                  <td :class="{ bronze: pig['place'] == 3 }" @click="place(race, pig, 3)">3</td>
                  <td>{{pig['name']}}</td>
                  <td v-for="(bet, betIndex) in pig['bets']" :key="'Bet-' + betIndex">
                    <img v-bind:src="getAvatar(bet)" class="avatar" />
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="winnings card bg-light mb-6 col-md-6 no-padding-r-l">
          <h2 class="card-title">Winnings</h2>
            <div v-for="(punter, winningsIndex) in punters" :key="winningsIndex">
            <div class="punter">{{punter['name']}}</div>
            <div class="punter-winnings">
              <div class="total" :style="{ width: getWidth(punter['winnings']) }">{{punter['winnings']}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: 'App',
  components: {},
  data() {
    return {
      currentRace: -1,
      running: false,
      playing: false,
      races: [
        {
          name: "Race One",
          hasRun: false,
          pigs: [
            { name: "Perky", bets: [], place: 0 },
            { name: "Babe", bets: [], place: 0 },
            { name: "Curly", bets: [], place: 0 },
            { name: "Pinky", bets: [], place: 0 },
            { name: "Chops", bets: [], place: 0 },
            { name: "Cheeky", bets: [], place: 0 },
            { name: "Pygmy", bets: [], place: 0 },
            { name: "Tom Trotter", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Two",
          hasRun: false,
          pigs: [
            { name: "Streaky Bob", bets: [], place: 0 },
            { name: "Bursting To Go", bets: [], place: 0 },
            { name: "Muck For Luck", bets: [], place: 0 },
            { name: "Big Willy", bets: [], place: 0 },
            { name: "Lester Piglet", bets: [], place: 0 },
            { name: "Hog Wart", bets: [], place: 0 },
            { name: "Mr Swilly", bets: [], place: 0 },
            { name: "Smell Your Mam", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Three",
          hasRun: false,
          pigs: [
            { name: "Jake The Pig", bets: [], place: 0 },
            { name: "Danish Delight", bets: [], place: 0 },
            { name: "Odour Eater", bets: [], place: 0 },
            { name: "Super Stud", bets: [], place: 0 },
            { name: "Wind Breaker", bets: [], place: 0 },
            { name: "Pie In The Sky", bets: [], place: 0 },
            { name: "Pig'n About", bets: [], place: 0 },
            { name: "Ugly Chops", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Four",
          hasRun: false,
          pigs: [
            { name: "Pig Tail", bets: [], place: 0 },
            { name: "Piggy Back", bets: [], place: 0 },
            { name: "Special Offer", bets: [], place: 0 },
            { name: "Smokey Joe", bets: [], place: 0 },
            { name: "Nyree Dawn Porker", bets: [], place: 0 },
            { name: "Douglas Hog", bets: [], place: 0 },
            { name: "Sunday Special", bets: [], place: 0 },
            { name: "Jobby", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Five",
          hasRun: false,
          pigs: [
            { name: "Apple Sauce", bets: [], place: 0 },
            { name: "Rocky", bets: [], place: 0 },
            { name: "The Flying Pig", bets: [], place: 0 },
            { name: "Skoda", bets: [], place: 0 },
            { name: "Shih Tzu", bets: [], place: 0 },
            { name: "Porcupine", bets: [], place: 0 },
            { name: "Super Stud", bets: [], place: 0 },
            { name: "Double Blank", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Six",
          hasRun: false,
          pigs: [
            { name: "Stew Pot", bets: [], place: 0 },
            { name: "Walters Plodder", bets: [], place: 0 },
            { name: "Hog Wash", bets: [], place: 0 },
            { name: "Miss Piggy", bets: [], place: 0 },
            { name: "Snorter", bets: [], place: 0 },
            { name: "Piggy Malone", bets: [], place: 0 },
            { name: "Lester Piglet", bets: [], place: 0 },
            { name: "Lynford Crispy Bacon", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Seven",
          hasRun: false,
          pigs: [
            { name: "Air Fungus", bets: [], place: 0 },
            { name: "Duty Free", bets: [], place: 0 },
            { name: "Flying Officer Kite", bets: [], place: 0 },
            { name: "Free Insurance", bets: [], place: 0 },
            { name: "Never On Time", bets: [], place: 0 },
            { name: "Full Board", bets: [], place: 0 },
            { name: "Not Quite Finished", bets: [], place: 0 },
            { name: "Trolley Dolley", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Eight",
          hasRun: false,
          pigs: [
            { name: "Rasher Dasher", bets: [], place: 0 },
            { name: "Shortts Snorter", bets: [], place: 0 },
            { name: "Tony's Trotter", bets: [], place: 0 },
            { name: "Pork Scratchings", bets: [], place: 0 },
            { name: "Trotsky", bets: [], place: 0 },
            { name: "Squealer", bets: [], place: 0 },
            { name: "Kelly's Porker", bets: [], place: 0 },
            { name: "Smokey Bacon", bets: [], place: 0 },
          ]
        },
        {
          name: "Race Nine",
          hasRun: false,
          pigs: [
            { name: "Domestos", bets: [], place: 0 },
            { name: "Oprah", bets: [], place: 0 },
            { name: "Lost In France", bets: [], place: 0 },
            { name: "Angus Mi Coat Up", bets: [], place: 0 },
            { name: "U Want Fork", bets: [], place: 0 },
            { name: "Nice One Cyril", bets: [], place: 0 },
            { name: "Nyrene Dawn Porker", bets: [], place: 0 },
            { name: "Reebok", bets: [], place: 0 }
          ]
        },
        {
          name: "Race Ten",
          hasRun: false,
          pigs: [
            { name: "Lady Godiva", bets: [], place: 0 },
            { name: "Wind Breaker", bets: [], place: 0 },
            { name: "Big Ben", bets: [], place: 0 },
            { name: "Dole Money", bets: [], place: 0 },
            { name: "Domino King", bets: [], place: 0 },
            { name: "Carling Darling", bets: [], place: 0 },
            { name: "Cook The Books", bets: [], place: 0 },
            { name: "Pile On The Track", bets: [], place: 0 }
          ]
        }
      ],
      punters: [
        { name: "Steve", avatar: "S", winnings: 0 },
        { name: "Fiona", avatar: "F", winnings: 0 },
        { name: "Chris", avatar: "C", winnings: 0 },
        { name: "Tony", avatar: "T", winnings: 0 },
        { name: "Jo Anne", avatar: "J", winnings: 0 },
        { name: "Rick", avatar: "R", winnings: 0 }
      ]
    }
  },
  methods: {
    playPause: function() {
      this.socket.emit("playPause")
    },
    getWidth(n) {
      return n / this.races.length * 10 + '%'
    },
    getAvatar(name) {
      return require("./assets/img/" + name.toLowerCase() + ".jpg")
    },
    getPlace(race, n) {
      for (var i = 0; i < race['pigs'].length; i++) {
        if (race['pigs'][i]['place'] == n) {
          return race['pigs'][i]['name']
        }
      }
    },
    nextRace: function() {
      if (this.currentRace < this.races.length - 1) {
        this.currentRace = this.currentRace + 1
      } else {
        this.currentRace = -1
      }
      this.socket.emit("setRace", { race: this.currentRace })
    },
    betOn: function(pig, punter) {
      this.socket.emit("bet", { pig: pig, punter: punter })
    },
    _betOn: function(pig, punter) {
      var pigs = this.races[this.currentRace]['pigs']
      for (var j = 0; j < pigs.length; j++) {
        var racePig = pigs[j]
        if (racePig['name'] == pig['name']) {
          pig = racePig
        }
        for (var k = 0; k < racePig['bets'].length; k++) {
          var bet = racePig['bets'][k]
          if (bet == punter['name']) {
            racePig['bets'].splice(k, 1)
          }
        }
      }
      pig['bets'].push(punter['name'])
      this.calculateWinnings()
    },
    place : function(race, pig, place) {
      this.socket.emit("place", { race: race, pig: pig, place: place })
    },
    _place: function(race, pig, place) {
      for (var i = 0; i < this.races.length; i++) {
        if (this.races[i]['name'] == race['name']) {
          race = this.races[i]
        }
      }
      for (i = 0; i < race['pigs'].length; i++) {
        if (race['pigs'][i]['name'] == pig['name']) {
          pig = race['pigs'][i]
        }
        if (race['pigs'][i]['place'] == place) {
          race['pigs'][i]['place'] = 0
        }
      }
      pig['place'] = place
      this.calculateWinnings()
    },
    addWinnings: function(name, place) {
      for (var i = 0; i < this.punters.length; i++) {
        var punter = this.punters[i]
        if (name == punter['name']) {
          switch(place) {
            case 1:
              punter['winnings'] = punter['winnings'] + 5
              break
            case 2:
              punter['winnings'] = punter['winnings'] + 3
              break
            case 3:
              punter['winnings'] = punter['winnings'] + 1
              break
            default:
              console.log('unknown place')
          }
        }
      }
    },
    calculateRaceWinnings(race) {
      for (var i = 0; i < race['pigs'].length; i++) {
        var pig = race['pigs'][i]
        if (pig['place'] > 0) {
          for (var j = 0; j < pig['bets'].length; j++) {
            this.addWinnings(pig['bets'][j], pig['place'])
          }
        }
      }
    },
    calculateWinnings: function() {
      for (var i = 0; i < this.punters.length; i++) {
        this.punters[i]['winnings'] = 0
      }
      for (i = 0; i < this.races.length; i++) {
        var race = this.races[i]
        this.calculateRaceWinnings(race)
      }
    },
    runRace: function() {
      this.socket.emit("runRace")
    },
    backToBetting: function() {
      this.socket.emit("backToBetting", {})
    },
    finish: function() {
      this.socket.emit("finish", {})
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
    this.socket.on("setRace", (data) => {
      this.currentRace = data['race']
    }),
    this.socket.on("bet", (data) => {
      this._betOn(data['pig'], data['punter'])
    }),
    this.socket.on("place", (data) => {
      this._place(data['race'], data['pig'], data['place'])
    }),
    this.socket.on("runRace", () => {
      this.running = true
    }),
    this.socket.on("playPause", () => {
      var video = document.getElementById("video-" + this.currentRace)
      console.log(video.src)
      if (video.paused) {
        video.play()
        this.playing = true
      } else {
        video.pause()
        this.playing = false
      }
    })
    this.socket.on("backToBetting", () => {
      this.running = false
    }),
    this.socket.on("finish", () => {
      this.running = false
      this.races[this.currentRace]['hasRun'] = true
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
  .avatar { width: 20px; height: 20px; }
  .punter-winnings { width: 80%; display: inline-block; margin: 6px 0; }
  .total { background-color: green; color: #fff; }

  .video { vertical-align: middle; }
</style>
