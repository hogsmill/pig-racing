<template>
  <div class="quiz">
    <div v-if="isHost">
      <i v-if="currentSlideNumber == 1" class="fas fa-caret-left" />
      <i v-if="currentSlideNumber > 1" class="fas fa-caret-left enabled" @click="previous()" :disabled="currentSlideNumber == 1" />
      <select id="go-to" class="form-control go-to" @click="goTo()">
        <option v-for="(s, index) in currentRound" :key="index" :value="index" :selected="s.number == currentSlide.number">
          {{ index + 1 }}: {{ s.title }}
        </option>
      </select>
      <i v-if="currentSlideNumber == currentRound.length" class="fas fa-caret-right" />
      <i v-if="currentSlideNumber < currentRound.length" class="fas fa-caret-right enabled" @click="next()" />
      <span v-if="currentRoundNumber == noOfRounds">(Last Round)</span>
      <span v-if="currentSlideNumber == currentRound.length">(Last Slide)</span>
    </div>
    <div v-if="!isHost" class="answer-div">
      <input type="text" id="answer" class="form-control answer">
      Submit Answer for:
      <button v-if="player1.id" class="btn btn-primary btn-sm" @click="submitAnswer(player1)">
        {{ player1.initials }}
      </button>
      <button v-if="player2.id" class="btn btn-primary btn-sm" @click="submitAnswer(player2)">
        {{ player2.initials }}
      </button>
      <button v-if="player3.id" class="btn btn-primary btn-sm" @click="submitAnswer(player3)">
        {{ player3.initials }}
      </button>
    </div>
    <div class="quiz-pic">
      <div id="slide" :class="'pic-' + currentSlide.number" />
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      slide: 1
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    },
    noOfRounds() {
      return this.$store.getters.getNoOfRounds
    },
    currentRoundNumber() {
      return this.$store.getters.getCurrentRoundNumber
    },
    currentRound() {
      return this.$store.getters.getCurrentRound
    },
    currentSlideNumber() {
      return this.$store.getters.getCurrentSlideNumber
    },
    currentSlide() {
      return this.$store.getters.getCurrentSlide
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
    previous() {
      this.socket.emit('setQuizSlide', {groupId: this.currentGroup.id, slide: this.currentSlideNumber - 1})
    },
    next() {
      this.socket.emit('setQuizSlide', {groupId: this.currentGroup.id, slide: this.currentSlideNumber + 1})
    },
    goTo() {
      const n = document.getElementById('go-to').value
      this.socket.emit('setQuizSlide', {groupId: this.currentGroup.id, slide: parseInt(n) + 1})
    },
    submitAnswer(player) {
      const answer = document.getElementById('answer').value
      this.socket.emit('submitAnswer', {groupId: this.currentGroup.id, punterId: player.id, slide: this.currentSlide, answer: answer})

    }
  }
}
</script>

<style lang="scss">

  .quiz {

     span {
       position: relative;
       top: -12px;
       font-style: italic;
       font-size: 1rem;
       color: #212529;
     }

    .answer-div {
      margin-bottom: 12px;
    }

    .form-control {
      display: inline-block;
    }

    .go-to {
      position: relative;
      top: -12px;
      width: 180px;
     }

     .answer {
       width: 400px;
     }

     .fas {
       margin: 6px 12px;
       color: #aaa;
       font-size: xxx-large;

       &.enabled {

         &:hover {
           color: #444;
         }
        }
     }

    .quiz-pic {
      padding: 6px;
      background-color: #000;

      #slide {
        margin: 0 auto;;
        height: 400px;
        width: 800px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position-x: center;

        &.pic-1 {
          background-image: url("../assets/img/quizzes/1.jpg");
        }
        &.pic-2 {
          background-image: url("../assets/img/quizzes/2.jpg");
        }
        &.pic-3 {
          background-image: url("../assets/img/quizzes/3.jpg");
        }
        &.pic-4 {
          background-image: url("../assets/img/quizzes/4.jpg");
        }
        &.pic-5 {
          background-image: url("../assets/img/quizzes/5.jpg");
        }
        &.pic-6 {
          background-image: url("../assets/img/quizzes/6.jpg");
        }
        &.pic-7 {
          background-image: url("../assets/img/quizzes/7.jpg");
        }
        &.pic-8 {
          background-image: url("../assets/img/quizzes/8.jpg");
        }
        &.pic-9 {
          background-image: url("../assets/img/quizzes/9.jpg");
        }
        &.pic-10 {
          background-image: url("../assets/img/quizzes/10.jpg");
        }
        &.pic-11 {
          background-image: url("../assets/img/quizzes/11.jpg");
        }
        &.pic-12 {
          background-image: url("../assets/img/quizzes/12.jpg");
        }
        &.pic-13 {
          background-image: url("../assets/img/quizzes/13.jpg");
        }
        &.pic-14 {
          background-image: url("../assets/img/quizzes/14.jpg");
        }
        &.pic-15 {
          background-image: url("../assets/img/quizzes/15.jpg");
        }
        &.pic-16 {
          background-image: url("../assets/img/quizzes/16.jpg");
        }
        &.pic-17 {
          background-image: url("../assets/img/quizzes/17.jpg");
        }
        &.pic-18 {
          background-image: url("../assets/img/quizzes/18.jpg");
        }
        &.pic-19 {
          background-image: url("../assets/img/quizzes/19.jpg");
        }
        &.pic-20 {
          background-image: url("../assets/img/quizzes/20.jpg");
        }
        &.pic-21 {
          background-image: url("../assets/img/quizzes/21.jpg");
        }
      }
    }
  }
</style>
