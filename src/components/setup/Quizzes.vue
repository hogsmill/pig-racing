<template>
  <table class="config-quizzes">
    <tr>
      <td>
        <h4>Quizzes</h4>
        <i v-if="showQuizzes" @click="setShowQuizzes(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showQuizzes" @click="setShowQuizzes(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showQuizzes">
      <td>
        <table>
          <tr>
            <td>
              Group
              <select id="quizzes-edit-group-select" class="group-select" @change="setEditingGroupId()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(group, gindex) in groups" :key="gindex" :selected="editingGroupId == group.id" :value="group.id">
                  {{ group.group }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            Rounds
            <select id="no-of-rounds" :value="editingGroupQuiz.noOfRounds" @change="setNoOfRounds()" :disabled="!editingGroupId">
              <option>
                -- Select --
              </option>
              <option v-for="(n, index) in 5" :key="index">
                {{ n }}
              </option>
            </select>
          </tr>
          <tr v-if="editingGroupId">
            <td>
              Slide
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 0">
              Round 1
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 1">
              Round 2
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 2">
              Round 3
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 3">
              Round 4
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 4">
              Round 5
            </td>
          </tr>
          <tr v-for="(slide, index) in slides" :key="index">
            <td v-if="editingGroupId">
              {{ slide.title }}
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 0">
              <input :id="'slide-round-' + slide.number + '-1'" type="checkbox" @click="putSlideInRound(slide.number, 1)" :checked="inRound(slide.number, 1)">
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 1">
              <input :id="'slide-round-' + slide.number + '-2'" type="checkbox" @click="putSlideInRound(slide.number, 2)" :checked="inRound(slide.number, 2)">
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 2">
              <input :id="'slide-round-' + slide.number + '-3'" type="checkbox" @click="putSlideInRound(slide.number, 3)" :checked="inRound(slide.number, 3)">
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 3">
              <input :id="'slide-round-' + slide.number + '-4'" type="checkbox" @click="putSlideInRound(slide.number, 4)" :checked="inRound(slide.number, 4)">
            </td>
            <td v-if="editingGroupQuiz.noOfRounds > 4">
              <input :id="'slide-round-' + slide.number + '-5'" type="checkbox" @click="putSlideInRound(slide.number, 5)" :checked="inRound(slide.number, 5)">
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showQuizzes: false
    }
  },
  computed: {
    groups() {
      return this.$store.getters.getGroups
    },
    quizzes() {
      return this.$store.getters.getQuizzes
    },
    slides() {
      return this.$store.getters.getSlides
    },
    editingGroupId() {
      return this.$store.getters.getEditingGroupId
    },
    editingGroupQuiz() {
      return this.$store.getters.getEditingGroupQuiz
    }
  },
  created(){
    bus.emit('sendLoadSlides')
  },
  methods: {
    setShowQuizzes(val) {
      this.showQuizzes = val
    },
    setEditingGroupId() {
      const groupId = document.getElementById('quizzes-edit-group-select').value
      this.$store.dispatch('setEditingGroupId', groupId)
    },
    setNoOfRounds() {
      const noOfRounds = document.getElementById('no-of-rounds').value
      bus.emit('sendSetNoOfRounds', {groupId: this.editingGroupId, noOfRounds: noOfRounds})
    },
    inRound(slide, round) {
      let inRound = false
      const roundN = this.editingGroupQuiz.rounds[round - 1]
      for (let i = 0; i < roundN.length; i++) {
        if (roundN[i].number == slide) {
          inRound = true
        }
      }
      return inRound
    },
    putSlideInRound(slide, round) {
      const checked = document.getElementById('slide-round-' + slide + '-' + round).checked
      if (checked) {
         bus.emit('sendPutSlideInRound', {groupId: this.editingGroupId, slide: slide, round: round})
      } else {
        bus.emit('sendDeleteSlideFromRound', {groupId: this.editingGroupId, slide: slide, round: round})
      }
    }
  }
}
</script>

<style lang="scss">
  .config-quizzes {

    .quizzes {
      width: 100%;
    }

    .race-include {
      text-align: center;
    }
  }
</style>
