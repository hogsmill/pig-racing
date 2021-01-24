<template>
  <div class="race" :class="{ current : currentRace == raceIndex }">
    <div class="race-name">
      <div class="race-name-name">
        {{ race['name'] }}
      </div>
      <div v-if="host && currentRace == raceIndex && !race['hasRun']" class="places">
        <button v-if="!race['pigsShown']" class="btn btn-primary btn-sm run-race" @click="showPigs()">
          Place Bets
        </button>
        <button v-if="race['pigsShown']" class="btn btn-primary btn-sm run-race" @click="runRace()">
          Run Race
        </button>
      </div>
    </div>
    <table v-if="raceIndex == currentRace">
      <tr>
        <td colspan="6" />
        <td />
        <td colspan="6">
          <div class="bet-header">
            Bets
          </div>
        </td>
      </tr>
      <tr v-for="(pig, pigIndex) in race['pigs']" :key="pigIndex">
        <td v-for="(pigPunter, pigPunterIndex) in punters" :key="pigPunterIndex">
          <img v-if="!pigPunter.initials && isPlayer(pigPunter)" @click="betOn(pig, pigPunter)" :src="getAvatar(pigPunter.name)" class="avatar">
          <div v-if="pigPunter.initials && isPlayer(pigPunter)" @click="betOn(pig, pigPunter)" class="rounded-circle initials">
            {{ pigPunter.initials }}
          </div>
          <span class="punter-span" v-if="!pigPunter.initials && isPlayer(pigPunter)" @click="betOn(pig, pigPunter)">{{ pigPunter['name'] }}</span>
        </td>
        <td :class="getPigPlace(pig)" class="rounded-left">
          <span v-if="getPigPlace(pig) == 'gold'"><img class="medal" src="../../assets/img/1st.png"></span>
          <span v-if="getPigPlace(pig) == 'silver'"><img class="medal" src="../../assets/img/2nd.png"></span>
          <span v-if="getPigPlace(pig) == 'bronze'"><img class="medal" src="../../assets/img/3rd.png"></span>
          <span v-if="getPigPlace(pig) == 'tin'"><img class="medal" src="../../assets/img/4th.png"></span>
          {{ pig['name'] }}
        </td>
        <td :class="getPigPlace(pig)" v-for="(bet, betIndex) in pig['bets']" :key="'Bet-' + betIndex">
          <img v-if="!bet.initials" :src="getAvatar(bet.name)" class="avatar">
          <div v-if="bet.initials" class="rounded-circle initials">
            {{ bet.initials }}
          </div>
        </td>
        <td :class="getPigPlace(pig)" class="rounded-right" />
      </tr>
    </table>
  </div>
</template>

<script>
import video from '../../lib/video.js'

export default {
  props: [
    'raceIndex',
    'race',
    'socket'
  ],
  computed: {
    host() {
      return this.$store.getters.getHost
    },
    currentRace() {
      return this.$store.getters.getCurrentRace
    },
    player1() {
      return this.$store.getters.getPlayer1
    },
    player2() {
      return this.$store.getters.getPlayer2
    },
    player3() {
      return this.$store.getters.getPlayer3
    },
    punterGroup() {
      return this.$store.getters.getPunterGroup
    },
    punters() {
      return this.$store.getters.getPunters
    },
    races() {
      return this.$store.getters.getRaces
    }
  },
  mounted() {
    this.socket.on('bet', (data) => {
      this._betOn(data['pig'], data['punter'])
    })
    this.socket.on('showPigs', () => {
      this.$store.dispatch('updateRunning', true)
      video.loadVideo(this.races[this.currentRace])
      if (this.currentRace > 0) {
        video.setVideoTime(30)
      }
      video.playVideo()
      this.$store.dispatch('updatePlaying', true)
      this.$store.dispatch('updateWatchingBetting', 'add')
      video.pauseVideoAt(110)
    })
    this.socket.on('backToBetting', () => {
      this.$store.dispatch('updateRunning', false)
    })
    this.socket.on('runRace', () => {
      this.$store.dispatch('updateRunning', true)
      video.setVideoTime(110)
      video.playVideo()
      this.$store.dispatch('updatePlaying', false)  // Why?
    })
    this.socket.on('finish', () => {
      this.$store.dispatch('updateRunning', false)
      video.pauseVideo()
      this.$store.dispatch('updateRaceHasRun', this.currentRace)
      this.calculateWinnings()
    })
    this.socket.on('place', (data) => {
      this._place(data['race'], data['pig'], data['place'])
    })
  },
  methods: {
    isPlayer(player) {
      const group = player.group == 'Footy'
      const isAPlayer = player.name == this.player1 || player.name == this.player2 || player.name == this.player3
      return group && isAPlayer
    },
    getAvatar(name) {
      try {
        return require('../../assets/img/' + name.toLowerCase() + '.jpg')
      } catch(e) {
        return require('../../assets/img/default.png')
      }
    },
    getPigPlace(pig) {
      if (!this.race.hasRun) {
        return ''
      } else {
        switch(pig.place) {
          case 1: return 'gold'
          case 2: return 'silver'
          case 3: return 'bronze'
          case 4: return 'tin'
        }
      }
    },
    getPlace(race, n) {
      for (let i = 0; i < race['pigs'].length; i++) {
        if (race['pigs'][i]['place'] == n) {
          return race['pigs'][i]['name']
        }
      }
    },
    place : function(race, pig, place) {
      if (this.host) {
        this.socket.emit('place', { race: race, pig: pig, place: place })
      }
    },
    _place: function(race, pig, place) {
      let i
      for (i = 0; i < this.races.length; i++) {
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
    betOn: function(pig, punter) {
      this.socket.emit('bet', { pig: pig, punter: punter })
    },
    _betOn: function(pig, punter) {
      const pigs = this.races[this.currentRace]['pigs']
      for (let j = 0; j < pigs.length; j++) {
        const racePig = pigs[j]
        if (racePig.name == pig.name) {
          pig = racePig
        }
        for (let k = 0; k < racePig.bets.length; k++) {
          const bet = racePig.bets[k]
          if (bet.name == punter.name) {
            racePig.bets.splice(k, 1)
          }
        }
      }
      pig.bets.push(punter)
    },
    addWinnings: function(bet, place) {
      for (let i = 0; i < this.punters.length; i++) {
        const punter = this.punters[i]
        if (bet.name == punter.name) {
          switch(place) {
            case 1:
              punter.winnings = punter.winnings + 10
              break
            case 2:
              punter.winnings = punter.winnings + 6
              break
            case 3:
              punter.winnings = punter.winnings + 3
              break
            case 4:
              punter.winnings = punter.winnings + 1
              break
            default:
              console.log('unknown place')
          }
        }
      }
    },
    calculateRaceWinnings(race) {
      for (let i = 0; i < race.pigs.length; i++) {
        const pig = race.pigs[i]
        if (pig.place > 0) {
          for (let j = 0; j < pig.bets.length; j++) {
            this.addWinnings(pig.bets[j], pig.place)
          }
        }
      }
    },
    calculateWinnings: function() {
      let i
      for (i = 0; i < this.punters.length; i++) {
        this.punters[i].winnings = 0
      }
      for (i = 0; i < this.races.length; i++) {
        const race = this.races[i]
        this.calculateRaceWinnings(race)
      }
    },
    showPigs: function() {
      this.socket.emit('showPigs')
    },
    runRace: function() {
      this.socket.emit('runRace')
    },
    pauseVideo: function() {
      video.pauseVideo()
      this.$store.dispatch('updateWatchingBetting', 'delete')
    }
  }
}
</script>

<style>
  .initials { background-color: #ccc; color: #fff; width: 24px; height: 24px; display: inline-block;  font-size: 76%; line-height: 2; }
  .medal { height: 20px; width: 20px; }
  .gold { color: #fff; background-color: goldenrod; }
  .silver { color: #444; background-color: #ddd; }
  .bronze { color: #fff; background-color: saddlebrown; }
  .tin { color: #fff; background-color: green; }
</style>
