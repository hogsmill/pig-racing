<template>
  <div class="winnings card bg-light mb-6 col-md-6 no-padding-r-l">
    <h2 class="card-title">
      {{ display }} League Table
    </h2>
    <div v-if="currentGroup.showQuiz" class="selecters">
      <div class="quiz-icon" @click="setDisplay('Quiz')" />
      <div class="pig-icon" @click="setDisplay('Races')" />
    </div>
    <div v-if="display == 'Races'">
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
            <div class="total-quiz rounded" :style="{ width: getQuizWidth(punter['quizScore']) }">
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
      display: 'Races'
    }
  },
  computed: {
    races() {
      return this.$store.getters.getRaces
    },
    racePunters() {
      return this.$store.getters.getRaceSortedPunters
    },
    quizPunters() {
      return this.$store.getters.getQuizSortedPunters
    },
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    }
  },
  methods: {
    getWidth(n) {
      return n / this.races.length * 10 + '%'
    },
    getQuizWidth(n) {
      return parseInt(n * 26) + 'px'
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
  }

  .total-races {
    background-color: green;
    color: #fff;
  }

  .total-quiz {
    background-color: blue;
    color: #fff;
  }

</style>
