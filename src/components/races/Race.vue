<template>
  <div class="race" :class="{ current : currentRace == raceIndex }">
    <div class="race-name">
      <div class="race-name-name">
        {{ race.name }}
      </div>
      <div v-if="host && currentRace == raceIndex && !race['hasRun']" class="places">
        <button v-if="!race['pigsShown']" class="btn btn-primary btn-sm run-race" @click="showPigs(raceIndex)">
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
          <div v-if="isPlayer(pigPunter)" @click="betOn(pig, pigPunter)" class="rounded-circle initials">
            {{ pigPunter.initials }}
          </div>
        </td>
        <td :class="getPigPlace(pig)" class="rounded-left">
          <span v-if="getPigPlace(pig) == 'gold'"><img class="medal" src="../../assets/img/1st.png"></span>
          <span v-if="getPigPlace(pig) == 'silver'"><img class="medal" src="../../assets/img/2nd.png"></span>
          <span v-if="getPigPlace(pig) == 'bronze'"><img class="medal" src="../../assets/img/3rd.png"></span>
          <span v-if="getPigPlace(pig) == 'tin'"><img class="medal" src="../../assets/img/4th.png"></span>
          {{ pig['name'] }}
        </td>
        <td :class="getPigPlace(pig)" v-for="(bet, betIndex) in pig['bets']" :key="'Bet-' + betIndex">
          <div class="rounded-circle initials">
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
    currentGroup() {
      return this.$store.getters.getCurrentGroup
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
    punters() {
      return this.$store.getters.getPunters
    },
    races() {
      return this.$store.getters.getRaces
    }
  },
  mounted() {
    this.socket.on('showPigs', (data) => {
      if (this.raceIndex == data.raceIndex) {
        this.$store.dispatch('updateRunning', true)
        video.loadVideo(this.races[this.currentRace])
        if (this.currentRace > 0) {
          video.setVideoTime(30)
        }
        window.setTimeout(function() {
          video.playVideo()
        }, 1000)
        this.$store.dispatch('updatePlaying', true)
        this.socket.emit('watchingBetting', {groupId: this.currentGroup.id, watchingBetting: true})
        video.pauseVideoAt(110, this.socket, this.currentGroup.id)
      }
    })

    this.socket.on('runRace', () => {
      this.$store.dispatch('updateRunning', true)
      video.setVideoTime(110)
      window.setTimeout(function() {
        video.playVideo()
      }, 1000)
      this.$store.dispatch('updatePlaying', false)  // Why?
    })

    this.socket.on('finish', () => {
      this.$store.dispatch('updateRunning', false)
      video.pauseVideo()
      this.$store.dispatch('updateRaceHasRun', this.currentRace)
    })

    this.socket.on('place', (data) => {
      this._place(data['race'], data['pig'], data['place'])
    })
  },
  methods: {
    isPlayer(player) {
      return player.id == this.player1.id || player.id == this.player2.id || player.id == this.player3.id
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
    betOn(pig, punter) {
      this.socket.emit('bet', {groupId: this.currentGroup.id, pig: pig, punter: punter})
    },
    showPigs(raceIndex) {
      this.socket.emit('showPigs', {raceIndex: raceIndex})
    },
    runRace(race) {
      this.socket.emit('runRace', {race: race})
    },
    pauseVideo() {
      video.pauseVideo()
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
