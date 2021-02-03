<template>
  <div>
    <Groups :socket="socket" />
    <Punters :socket="socket" />
    <Races :socket="socket" />
  </div>
</template>

<script>
import Groups from './setup/Groups.vue'
import Punters from './setup/Punters.vue'
import Races from './setup/Races.vue'

export default {
  components: {
    Groups,
    Punters,
    Races
  },
  props: [
    'socket'
  ],
  created() {
    this.socket.emit('loadGroups')
  }
}
</script>

<style lang="scss">
.config-groups, .config-punters, .config-races {
  width: 600px;
  margin: 12px auto;
  border: 1px solid #ccc;

  .toggle {
    color: #aaa;
    font-size: xx-large;

    &:hover {
      cursor: pointer;
    }
  }

  .left {
    text-align: left;
  }

  h4 {
    display: inline-block;
    text-align: left;
  }

  i.toggle {
    position: absolute;
    right: 6px;
  }

  input[type=text] {
    width: 200px;
  }

  td {
    vertical-align: top;
    position: relative;
    padding: 4px;
    text-align: left;

    &.center {
      text-align: center;
    }
    &.left-col {
      vertical-align: top;
    }
    .fa-edit, .fa-save, .fa-trash-alt, .fa-chevron-up, .fa-chevron-down, .fa-file-alt, .fa-clone {
      color: #888;
      font-size: x-large;
      margin: 4px;

      &:hover {
        cursor: pointer;
        color: #444;
      }
    }
  }

  input {
    height: 24px;
    padding: 2px;
    margin: 0 auto;
  }

  button {
    margin-left: 4px;
  }
}
</style>
