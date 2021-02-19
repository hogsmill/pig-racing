<template>
  <div>
    <div class="name-select">
      Player 1:
      <select id="name-select-1" class="form-control" @change="setPlayer(1)">
        <option value="">
          -- Select --
        </option>
        <option v-for="(punter, index) in punters" :key="index" :value="punter.id" :selected="punter.id == player1.id">
          {{ punter.name }}
        </option>
      </select>
    </div>
    <div class="name-select">
      Player 2:
      <select id="name-select-2" class="form-control" @change="setPlayer(2)">
        <option value="">
          -- Select --
        </option>
        <option v-for="(punter, index) in punters" :key="index" :value="punter.id" :selected="punter.id == player2.id">
          {{ punter.name }}
        </option>
      </select>
    </div>
    <div class="name-select">
      Player 3:
      <select id="name-select-3" class="form-control" @change="setPlayer(3)">
        <option value="">
          -- Select --
        </option>
        <option v-for="(punter, index) in punters" :key="index" :value="punter.id" :selected="punter.id == player3.id">
          {{ punter.name }}
        </option>
      </select>
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
  computed: {
    punters() {
      return this.$store.getters.getPunters
    },
    player1() {
      return this.$store.getters.getPlayer1
    },
    player2() {
      return this.$store.getters.getPlayer2
    },
    player3() {
      return this.$store.getters.getPlayer3
    }
  },
  methods: {
    clearPlayer(n) {
      this.players[n - 1] = ''
      this.$store.dispatch('updatePlayer' + n, '')
    },
    setPlayer(n) {
      const id = document.getElementById('name-select-' + n).value
      if (id) {
        player = this.punters.find(function(p) {
          return p.id == id
        })
        localStorage.setItem('pr-player-' + n, JSON.stringify(player))
        this.$store.dispatch('updatePlayer' + n, player)
      } else {
        localStorage.removeItem('pr-player-' + n)
      }
    }
  }
}
</script>

<style lang="scss">
  .name-select {
    text-align: right;
    height: 44px;
    padding-right: 6px;
    display: inline-block;

    select {
      width: 250px;
      display: inline;
    }
  }
</style>
