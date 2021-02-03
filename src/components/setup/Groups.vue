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
            <td colspan="2">
              New Group <input type="text" class="new-group" id="new-group">
              <button @click="addGroup()">
                Add
              </button>
            </td>
          </tr>
          <tr v-for="(group, index) in groups" :key="index">
            <td>
              <input type="checkbox" :checked="currentGroup.id == group.id" @click="setGroup(group.id)">
              <i @click="deleteGroup(group.id)" :title="'Delete ' + group.group" class="fas fa-trash-alt" />
              {{ group.group }}
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
    deleteGroup(id) {
      this.socket.emit('deleteGroup', {id: id})
    }
  }
}
</script>

<style lang="scss">
  .config-groups {
  }
</style>
