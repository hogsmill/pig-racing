<template>
  <div>
    <div class="name-select">Player 1:
      <select id="name-select-1" class="form-control" v-if="!player1" v-model="players[0]" @change="setPlayer(1, players[0])">
        <option v-for="(punter, index) in punters" :key="index">{{punter.name}}</option>
      </select>
      <span v-if="player1"><strong>{{player1}}</strong></span>
      <button v-if="player1" class="btn btn-light btn-sm" @click="function() { clearPlayer(1) }">Clear</button>
    </div>
    <div class="name-select">Player 2:
      <select id="name-select-2" class="form-control" v-if="!player2" v-model="players[1]" @change="setPlayer(2, players[1])">
        <option v-for="(punter, index) in punters" :key="index">{{punter.name}}</option>
      </select>
      <span v-if="player2"><strong>{{player2}}</strong></span>
      <button v-if="player2" class="btn btn-light btn-sm" @click="function() { clearPlayer(2) }">Clear</button>
    </div>
    <div class="name-select">Player 3:
      <select id="name-select-3" class="form-control" v-if="!player3" v-model="players[2]" @change="setPlayer(3, players[2])">
        <option v-for="(punter, index) in punters" :key="index">{{punter.name}}</option>
      </select>
      <span v-if="player3"><strong>{{player3}}</strong></span>
      <button v-if="player3" class="btn btn-light btn-sm" @click="function() { clearPlayer(3) }">Clear</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: ['', '', '']
    }
  },
  methods: {
    clearPlayer(n) {
      this.players[n - 1] = ''
      this.$store.dispatch("updatePlayer" + n, "")
    },
    setPlayer(n, name) {
      this.$store.dispatch("updatePlayer" + n, name)
    }
  },
  computed: {
    punters() {
      var allPunters = this.$store.getters.getPunters
      var punterGroup = this.$store.getters.getPunterGroup
      var punters = []
      for (var i = 0; i < allPunters.length; i++) {
        if (allPunters[i].group == punterGroup) {
          punters.push(allPunters[i])
        }
      }
      return punters
    },
    player1() {
      return this.$store.getters.getPlayer1;
    },
    player2() {
      return this.$store.getters.getPlayer2;
    },
    player3() {
      return this.$store.getters.getPlayer3;
    }
  }
}
</script>

<style>
  .name-select { text-align: right; height: 44px; padding-right: 6px; display: inline-block; }
  .name-select select { width: 100px; display: inline; }
</style>
