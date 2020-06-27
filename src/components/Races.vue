<template>
  <div class="races card-body bg-light mb-6 col-md-6 no-padding-r-l">
    <div v-for="(race, raceIndex) in races" :key="raceIndex">
      <Race v-bind:race="race" v-bind:raceIndex="raceIndex" />
    </div>
  </div>
</template>

<script>
import Race from "./races/Race.vue";

export default {
  components: {
    Race
  },
  computed: {
    running() {
      return this.$store.getters.getRunning;
    },
    races() {
      return this.$store.getters.getRaces;
    }
  }
}
</script>
