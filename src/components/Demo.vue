<template>
  <div class="demo-results rounded" :class="{hidden : running }">
    <h2>How it works</h2>
    <table v-if="page == 1">
      <tr>
        <td>
          <div class="demo-results-img" />
        </td>
        <td>
          <p>
            On the left, you can see a screenshot of a recently completed game. Games work
            as follows. Players first see a video of all the pigs. Click the button below
            to see this
          </p>
          <div>
            <button class="btn btn-primary btn-sm" @click="showDemoPigs()">
              Show Pigs
            </button>
          </div>
          <p>
            They then place bets by clicking on the pigs on their own browser
            (<i>see under 'Race Six' on the screenshot</i>).
          </p>
          <p>
            The race is then run - use the button below to see an example. (<i>You
              may need to press play on the video in Demo mode - this isn't needed in the
              real game</i>)
          </p>
          <div>
            <button class="btn btn-primary btn-sm" @click="runDemoRace()">
              Play Demo Race
            </button>
          </div>
          <p>
            After the race, the coloured bars show race placings. Players get points for the top 4 places.
          </p>
          <p>
            The table on the right shows a league table of points after each race.
          </p>
          <div>
            <button class="btn btn-primary btn-sm" @click="setPage(2)">
              Next &#x0226B;
            </button>
          </div>
        </td>
      </tr>
    </table>
    <table v-if="page == 2">
      <tr>
        <td>
          <div class="demo-race-img" />
        </td>
        <td>
          <p>
            The entire game is played in the player's own browser - there is no screen
            sharing - and multiple players can play in the same location if needed. The host
            controls the video playback, and again, videos run on the players own machine.
          </p>
          <p>
            Bets and winning points are automatically calculated and displayed in real time
            so the experience is hopefully as slick and as close to the real thing as possible.
          </p>
          <p>
            Feel free to give us feedback and suggestions by clicking the Feedback tab
          </p>
          <div>
            <button class="btn btn-primary btn-sm" @click="setPage(1)">
              &#x0226A; Previous
            </button>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import video from '../lib/video.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      page: 1
    }
  },
  computed: {
    running() {
      return this.$store.getters.getRunning
    }
  },
  created() {
    this.socket.on('runDemoRace', () => {
      this.$store.dispatch('updateRunning', true)
      video.setVideoTime(110)
      video.playVideo()
      this.$store.dispatch('updatePlaying', false)  // Why?
    })
  },
  methods: {
    setPage(page) {
      this.page = page
    },
    showDemoPigs() {
      this.$store.dispatch('updateDemoRaceFinished', false)
      this.$store.dispatch('updateCurrentRace', 1)
      this.socket.emit('showPigs')
    },
    runDemoRace: function() {
      this.socket.emit('runDemoRace')
    },
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

    .demo-race-img {
      margin: 6px;
      height: 300px;
      width: 450px;
      background-image: url("../assets/img/demo-race.jpg");
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
    }
  }

</style>
