<template>
  <table class="config-groups">
    <tr>
      <td>
        <h4>
          Groups
          <span v-if="currentGroup.id">(Current Group: '{{ currentGroup.group }}')</span>
        </h4>
        <i v-if="showGroups" @click="setshowGroups(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGroups" @click="setshowGroups(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGroups">
      <td>
        <table>
          <tr>
            <td colspan="3">
              New Group <input type="text" class="new-group" id="new-group">
              <button @click="addGroup()">
                Add
              </button>
            </td>
          </tr>
          <tr>
            <td />
            <td>
              Double points on last race?
            </td>
            <td>
              Include quiz?
            </td>
            <td>
              Combine scores?
            </td>
          </tr>
          <tr v-for="(group, index) in groups" :key="index">
            <td>
              <input type="checkbox" :checked="currentGroup.id == group.id" @click="setGroup(group.id)">
              <i @click="deleteGroup(group.id)" :title="'Delete ' + group.group" class="fas fa-trash-alt" />
              {{ group.group }}
            </td>
            <td class="center">
              <input type="checkbox" :checked="group.doublePointsOnLastRace" @click="setGroupDoublePointsOnLastRace(group.id)">
            </td>
            <td class="center">
              <input type="checkbox" :checked="group.showQuiz" @click="setGroupQuiz(group.id)">
            </td>
            <td class="center">
              <input type="checkbox" :checked="group.combineScores" :disabled="!group.showQuiz" @click="setGroupCombineScores(group.id)">
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showGroups: false
    }
  },
  computed: {
    groups() {
      return this.$store.getters.getGroups
    },
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    }
  },
  methods: {
    setshowGroups(val) {
      this.showGroups = val
    },
    addGroup() {
      const group = document.getElementById('new-group').value
      if (!group) {
        alert('Please enter a value')
      } else {
        this.socket.emit('addGroup', {group: group})
        document.getElementById('new-group').value = ''
      }
    },
    setGroup(id) {
      this.socket.emit('setGroup', {id: id})
    },
    setGroupDoublePointsOnLastRace(id) {
      this.socket.emit('setGroupDoublePointsOnLastRace', {id: id})
    },
    setGroupQuiz(id) {
      this.socket.emit('setGroupQuiz', {id: id})
    },
    setGroupCombineScores(id) {
      this.socket.emit('setGroupCombineScores', {id: id})
    },
    deleteGroup(id) {
      this.socket.emit('deleteGroup', {id: id})
    }
  }
}
</script>

<style lang="scss">
  .config-groups {

    input[type=checkbox] {
      position: relative;
      top: 6px;
    }
  }
</style>
