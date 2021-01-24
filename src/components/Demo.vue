<template>
  <div class="demo-results rounded" :class="{hidden : running }">
    <h2>How it works</h2>
    <table>
      <tr>
        <td>
          <div class="demo-results-img" />
        </td>
        <td>
          <p>
            One left, you can see a screenshot of a completed game. Players see a video of
            all the pigs, and place bets by clicking on the pigs on their own browser
            (<i>see under 'Race Six' on the screenshot</i>)
          </p>
          <p>
            The race is then run - use the button below to see an example.
          </p>
          <div>
            <button class="btn btn-primary btn-sm" @click="playDemoRace()">
              Play Demo Race
            </button>
          </div>
          <p>
            After the race, the coloured bars show race placings. Players get points for the top 4 places.
          </p>
          <p>
            The table on the right shows a league table of points after each race.
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    running() {
      return this.$store.getters.getRunning
    }
  },
  methods: {
    playDemoRace() {
      this.$store.dispatch('updateDemoRaceFinished', false)
      this.$store.dispatch('updateCurrentRace', 1)
      this.socket.emit('showPigs')
    }
  }
}
</script>

<style lang="scss">

  .demo-results {
    margin-top: 36px;
    border: 1px solid #bbb;
    padding: 12px;

    p {
      text-align: left;
    }

    button {
      margin-bottom: 24px;
    }

    td {
      vertical-align: top;
      padding: 12px;
    }

    .demo-results-img {
      margin: 6px;
      height: 300px;
      width: 450px;
      background-image: url("../assets/img/demo-results.jpg");
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
    }
  }

</style>
