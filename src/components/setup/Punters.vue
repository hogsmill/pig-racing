<template>
  <table class="config-punters">
    <tr>
      <td>
        <h4>Punters</h4>
        <i v-if="showPunters" @click="setShowPunters(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showPunters" @click="setShowPunters(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showPunters">
      <td>
        <table>
          <tr>
            <td>
              Group
              <select id="punters-edit-group-select" class="group-select" @change="setEditingGroupId()">
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
            <td>
              Max number of people per browser
              <select id="max-punters" @change="setMaxPunters()">
                <option :selected="editingGroupMaxPunters == 1 || !editingGroupMaxPunters">
                  1
                </option>
                <option :selected="editingGroupMaxPunters == 2">
                  2
                </option>
                <option :selected="editingGroupMaxPunters == 3">
                  3
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              New Punter <input type="text" class="new-group" id="new-punter">
              <button @click="addPunter()" :disabled="!editingGroupId">
                Add
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <table class="punters">
                <thead>
                  <tr>
                    <th />
                    <th>
                      Name
                    </th>
                    <th>
                      Initials
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(punter, pindex) in editingGroupPunters" :key="pindex" :value="editingGroupId">
                    <td class="center">
                      <i @click="deletePunter(punter.id)" :title="'Delete ' + punter.name" class="fas fa-trash-alt" />
                      <input type="checkbox" :checked="punter.include" @click="toggleInclude(punter.id)">
                    </td>
                    <td>
                      {{ punter.name }}
                    </td>
                    <td>
                      {{ punter.initials }}
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
      showPunters: false
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
    editingGroupMaxPunters() {
      return this.$store.getters.getEditingGroupMaxPunters
    }
  },
  methods: {
    setShowPunters(val) {
      this.showPunters = val
    },
    setEditingGroupId() {
      const groupId = document.getElementById('punters-edit-group-select').value
      this.$store.dispatch('setEditingGroupId', groupId)
    },
    addPunter() {
      const punter = document.getElementById('new-punter').value
      if (!punter) {
        alert('Please enter a value')
      } else {
        bus.emit('sendAddPunter', {groupId: this.editingGroupId, punter: punter})
        document.getElementById('new-punter').value = ''
      }
    },
    setMaxPunters() {
      const n = document.getElementById('max-punters').value
      bus.emit('sendSetMaxPunters', {groupId: this.editingGroupId, value: n})
    },
    deletePunter(id) {
      bus.emit('sendDeletePunter', {groupId: this.editingGroupId, id: id})
    },
    toggleInclude(id) {
      bus.emit('sendToggleIncludePunter', {groupId: this.editingGroupId, id: id})
    }
  }
}
</script>

<style lang="scss">
  .config-punters {

    .punters {
      width: 100%;

      .center {
        text-align: center;
      }

      input[type=checkbox] {
        margin: 2px;
      }
    }
  }
</style>
