<template>
  <div class="races card-body bg-light mb-6 col-md-6 no-padding-r-l" :class="{'demo': demo}">
    <div v-for="(race, raceIndex) in races" :key="raceIndex">
      <Race v-if="currentGroup.include && currentGroup.include[race.name]" :race="race" :race-index="raceIndex" />
    </div>
  </div>
</template>

<script>
import Race from './races/Race.vue'

export default {
  components: {
    Race
  },
  computed: {
    demo() {
      return this.$store.getters.getDemo
    },
    running() {
      return this.$store.getters.getRunning
    },
    races() {
      return this.$store.getters.getRaces
    },
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    }
  }
}
</script>

<style lang="scss">
  .races {
    &.demo {
      display: none;
    }
  }
</style>
