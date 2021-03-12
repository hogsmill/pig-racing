<template>
  <table class="config-answers">
    <tr>
      <td>
        <h4>Answers</h4>
        <i v-if="showAnswers" @click="setShowAnswers(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showAnswers" @click="setShowAnswers(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showAnswers">
      <td>
        <table class="answers-table">
          <tr>
            <td>
              Group
              <select id="answers-edit-group-select" class="group-select" @change="setEditingGroupId()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(group, gindex) in groups" :key="gindex" :selected="editingGroupId == group.id" :value="group.id">
                  {{ group.group }}
                </option>
              </select>
            </td>
          </tr>
          <tr v-if="editingGroupId">
            <td>
              Punter
              <select id="answers-edit-punter-select" class="group-select" @change="setSelectedPunterId()">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(punter, pindex) in editingGroupPunters" :key="pindex" :selected="punter.id == selectedPunterId" :value="punter.id">
                  {{ punter.name }}
                  {{ marked(punter.quizAnswers) }} / {{ punter.quizAnswers ? punter.quizAnswers.length : 0 }}
                  <b v-if="allMarked(punter.quizAnswers)" class="tick">&#10003;</b>
                  <b v-if="!allMarked(punter.quizAnswers)" class="cross">&#10007;</b>
                </option>
              </select>
            </td>
          </tr>
          <tr v-if="editingGroupId && selectedPunterId">
            <td>
              <div>
                Correct: {{ correct() }} / {{ noOfSelectedSlides }}
              </div>
            </td>
          </tr>
          <tr v-if="editingGroupId && selectedPunterId">
            <td>
              <table class="punter-slides">
                <thead>
                  <tr>
                    <th>
                      Slide
                    </th>
                    <th>
                      Correct
                    </th>
                    <th>
                      Title
                    </th>
                    <th>
                      Answer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(slide, sindex) in punterSlides()" :key="sindex">
                    <td>
                      {{ slide.slide.number }}
                    </td>
                    <td>
                      Right <input type="radio" :name="'answer-' + slide.slide.number" :checked="slide.slide.correct == true" @click="setAnswerCorrect(slide.slide.number, true)">
                      Wrong <input type="radio" :name="'answer-' + slide.slide.number" :checked="slide.slide.correct == false" @click="setAnswerCorrect(slide.slide.number, false)">
                    </td>
                    <td>
                      {{ slide.slide.title }}
                      <i class="fas fa-question-circle" :title="slide.slide.answer" />
                    </td>
                    <td>
                      {{ slide.answer }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
      showAnswers: false,
      selectedPunterId: null
    }
  },
  computed: {
    groups() {
      return this.$store.getters.getGroups
    },
    editingGroupId() {
      return this.$store.getters.getEditingGroupId
    },
    editingGroupPunters() {
      return this.$store.getters.getEditingGroupPunters
    },
    noOfSelectedSlides() {
      return this.$store.getters.getNoOfSelectedSlides
    },
  },
  methods: {
    setShowAnswers(val) {
      this.showAnswers = val
    },
    setSelectedPunterId() {
      this.selectedPunterId = document.getElementById('answers-edit-punter-select').value
    },
    setEditingGroupId() {
      const groupId = document.getElementById('answers-edit-group-select').value
      this.$store.dispatch('setEditingGroupId', groupId)
      this.selectedPunterId = null
    },
    punterSlides() {
      const self = this
      return this.editingGroupPunters.find(function(p) {
        return p.id == self.selectedPunterId
      }).quizAnswers
    },
    getSlideAnswer(n) {
      let answer = ''
      if (this.editingGroupPunters) {
        const self = this
        const punter = this.editingGroupPunters.find(function(p) {
          return p.id == self.selectedPunterId
        })
        if (punter) {
          const slideAnswer = punter.quizAnswers.find(function(a) {
            return a.slide.number == n
          })
          answer = slideAnswer ? slideAnswer.answer : ''
        }
      }
      return answer
    },
    setAnswerCorrect(slide, value) {
      bus.$emit('sendSetAnswerCorrect', {groupId: this.editingGroupId, punterId: this.selectedPunterId, slide: slide, value: value})
    },
    allMarked(slides) {
      return slides ? this.marked(slides) == slides.length : false
    },
    marked(slides) {
      let marked = 0
      if (slides) {
        for (let i = 0; i < slides.length; i++) {
          if ('correct' in slides[i].slide) {
            marked = marked + 1
          }
        }
      }
      return marked
    },
    correct() {
      const self = this
      const punter = this.editingGroupPunters.find(function(p) {
        return p.id == self.selectedPunterId
      })
      return punter && punter.quizScore ?  punter.quizScore : 0
    }
  }
}
</script>

<style lang="scss">
  .config-answers {

    .answers-table {
      width: 100%;
    }

    .answers {
      width: 100%;

      .center {
        text-align: center;
      }
    }

    .punter-slides {
      width: 100%;

      th {
        font-weight: bold;
        text-align: center;
      }

      th, td {
        border: 1px solid #aaa;
      }

      input[type=radio] {
        height: 12px;
        margin: 2px 12px 2px 2px;
      }

      .fa-question-circle {
        color: green;
      }
    }
  }
</style>
