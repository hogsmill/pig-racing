<template>
  <div class="winnings card bg-light mb-6 col-md-6 no-padding-r-l">
    <h2 class="card-title">
      {{ title() }} Standings
    </h2>
    <div v-if="currentGroup.showQuiz && !currentGroup.combineScores" class="selecters">
      <div class="quiz-icon" @click="setDisplay('Quiz')" />
      <div class="pig-icon" @click="setDisplay('Race')" />
    </div>
    <div v-if="combineScores">
      <div v-for="(punter, bIndex) in bothPunters" :key="bIndex">
        <div>
          <div class="punter">
            {{ punter['name'] }}
          </div>
          <div class="punter-winnings">
            <div v-if="punter['winnings'] > 0" class="total-races" :class="getRounded(punter, 'races')" :style="{ width: getWidth(punter['winnings']) }">
              {{ punter['winnings'] }}
            </div>
            <div v-if="punter['quizScore'] > 0" class="total-quiz" :class="getRounded(punter, 'quiz')" :style="{ width: getWidth(punter['quizScore']) }">
              {{ punter['quizScore'] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!combineScores && display == 'Race'">
      <div v-for="(punter, rIndex) in racePunters" :key="rIndex">
        <div>
          <div class="punter">
            {{ punter['name'] }}
          </div>
          <div class="punter-winnings">
            <div class="total-races rounded" :style="{ width: getWidth(punter['winnings']) }">
              {{ punter['winnings'] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="display == 'Quiz'">
      <div v-for="(punter, qIndex) in quizPunters" :key="qIndex">
        <div>
          <div class="punter">
            {{ punter['name'] }}
          </div>
          <div class="punter-winnings">
            <div class="total-quiz rounded" :style="{ width: getWidth(punter['quizScore']) }">
              {{ punter['quizScore'] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: 'Race'
    }
  },
  computed: {
    races() {
      return this.$store.getters.getRaces
    },
    combineScores() {
      return this.$store.getters.getCombineScores
    },
    racePunters() {
      return this.$store.getters.getRaceSortedPunters
    },
    quizPunters() {
      return this.$store.getters.getQuizSortedPunters
    },
    bothPunters() {
      return this.$store.getters.getBothSortedPunters
    },
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    },
    noOfSelectedSlides() {
      return this.$store.getters.getNoOfSelectedSlides
    },
    doublePointsOnLastRace() {
      return this.$store.getters.getDoublePointsOnLastRace
    }
  },
  methods: {
    title() {
      return this.combineScores ? '' : this.display
    },
    maxScore() {
      let max
      const nRaces = this.doublePointsOnLastRace ? this.races.length + 1 : this.races.length
      if (this.display == 'Quiz') {
        max = this.noOfSelectedSlides
      } else {
        max = nRaces * 10
        if (!this.combineScores) {
          max = max + this.noOfSelectedSlides
        }
      }
      return max
    },
    getWidth(n) {
      return n / this.maxScore() * 100 + '%'
    },
    getRounded(punter, type) {
      let rounded
      if (type == 'quiz') {
        rounded = punter.winnings > 0 ? 'rounded-right' : 'rounded'
      } else {
        rounded = punter.quizScore > 0 ? 'rounded-left' : 'rounded'
      }
      return rounded
    },
    setDisplay(display) {
      this.display = display
    }
  }
}
</script>

<style lang="scss">
  .selecters {
    height: 24px;

    div {
      height: 24px;
      float: right;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;

      &.pig-icon {
        width: 24px;
        background-image: url("../assets/img/pig.png");
      }

      &.quiz-icon {
        width: 38px;
        background-image: url("../assets/img/quiz.jpg");
      }
    }

  }

  .punter {
    width: 25%;
    display: inline-block;
    margin: 6px 0;
  }

  .punter-winnings {
    width: 75%;
    display: inline-block;
    margin: 6px 0;
    text-align: left;

    div {
      display: inline-block;
      color: #fff;
      text-align: center;
      min-width: 10px;

      &.total-races {
        background-color: green;
      }

      &.total-quiz {
        background-color: blue;
      }
    }
  }

</style>
