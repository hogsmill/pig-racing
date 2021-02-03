<template>
  <table class="config-races">
    <tr>
      <td>
        <h4>Races</h4>
        <i v-if="showRaces" @click="setShowRaces(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showRaces" @click="setShowRaces(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showRaces">
      <td>
        <table>
          <tr colspan="2">
            <td>
              Group
              <select id="race-edit-group-select" class="group-select" @change="setEditingGroupId()" :value="editingGroupId">
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
            <td class="race-include">
              <b>Include?</b>
            </td>
            <td>
              <b>Race Name</b>
            </td>
          </tr>
          <tr v-for="(race, index) in races" :key="index">
            <td class="race-include">
              <input type="checkbox" :checked="editingGroupInclude[race.name]" @click="includeRace(race.name)">
            </td>
            <td>
              {{ race.name }}
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
      showRaces: false
    }
  },
  computed: {
    groups() {
      return this.$store.getters.getGroups
    },
    races() {
      return this.$store.getters.getRaces
    },
    editingGroupId() {
      return this.$store.getters.getEditingGroupId
    },
    editingGroupInclude() {
      return this.$store.getters.getEditingGroupInclude
    }
  },
  methods: {
    setShowRaces(val) {
      this.showRaces = val
    },
    setEditingGroupId() {
      const groupId = document.getElementById('race-edit-group-select').value
      this.$store.dispatch('setEditingGroupId', groupId)
    },
    includeRace(race) {
      this.socket.emit('includeRace', {groupId: this.editingGroupId, race: race})
    }
  }
}
</script>

<style lang="scss">
  .config-races {

    .races {
      width: 100%;
    }

    .race-include {
      text-align: center;
    }
  }
</style>
