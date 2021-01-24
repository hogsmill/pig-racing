<template>
  <div class="winnings card bg-light mb-6 col-md-6 no-padding-r-l">
    <h2 class="card-title">
      Winnings
    </h2>
    <div v-for="(punter, winningsIndex) in punters" :key="winningsIndex">
      <div v-if="punterGroup == punter.group">
        <div class="punter">
          {{ punter['name'] }}
        </div>
        <div class="punter-winnings">
          <div class="total" :style="{ width: getWidth(punter['winnings']) }">
            {{ punter['winnings'] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    races() {
      return this.$store.getters.getRaces
    },
    punterGroup() {
      return this.$store.getters.getPunterGroup
    },
    punters() {
      return this.$store.getters.getSortedPunters
    }
  },
  methods: {
    getWidth(n) {
      return n / this.races.length * 10 + '%'
    }
  }
}
</script>
