import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function currentGroup(state) {
  const group = state.groups.find(function(g) {
    return g.current == true
  })
  return group ? group : {}
}

function currentEditingGroup(state) {
  const editingGroup = state.groups.find(function(g) {
    return g.id == state.editingGroupId
  })
  return editingGroup ? editingGroup : {}
}

export const store = new Vuex.Store({
  state: {
    thisGame: 'Pig Racing',
    currentTab: 'racing',
    host: false,
    demo: false,
    demoRaceFinished: false,
    currentRace: -1,
    running: false,
    playing: false,
    watchingBetting: {},
    player1: {},
    player2: {},
    player3: {},
    punterGroup: 'Footy',
    avatarType: 'initials',
    groups: [],
    editingGroupId: null,
    punters: [

      { name: 'Steve', avatar: 'S', winnings: 0, group: 'Wellses' },
      { name: 'Fiona', avatar: 'F', winnings: 0, group: 'Wellses' },
      { name: 'Chris', avatar: 'C', winnings: 0, group: 'Wellses' },
      { name: 'Tony', avatar: 'T', winnings: 0, group: 'Wellses' },
      { name: 'Jo Anne', avatar: 'J', winnings: 0, group: 'Wellses' },
      { name: 'Rick', avatar: 'R', winnings: 0, group: 'Wellses' },

      { name: 'Greg', initials: 'GC', winnings: 0, group: 'Footy' },
      { name: 'Gaffer', initials: 'MH', winnings: 0, group: 'Footy' },
      { name: 'Steve Archer', initials: 'SA', winnings: 0, group: 'Footy' },
      { name: 'Adrian Maher', initials: 'AM', winnings: 0, group: 'Footy' },
      { name: 'Richard Hodgson', initials: 'RH', winnings: 0, group: 'Footy' },
      { name: 'Andy Keaney', initials: 'AK', winnings: 0, group: 'Footy' },
      { name: 'Dave Wood', initials: 'DW', winnings: 0, group: 'Footy' },
      { name: 'Jo Wood', initials: 'JW', winnings: 0, group: 'Footy' },
      { name: 'Nick Williams', initials: 'NW', winnings: 0, group: 'Footy' },
      { name: 'Brendon Richards', initials: 'BR', winnings: 0, group: 'Footy' },
      { name: 'Kevin Murphy', initials: 'KM', winnings: 0, group: 'Footy' },
      { name: 'Darrell', initials: 'D', winnings: 0, group: 'Footy' },
      { name: 'Dave Peel', initials: 'DP', winnings: 0, group: 'Footy' },
      { name: 'Dave Edwards', initials: 'DW', winnings: 0, group: 'Footy' },
      { name: 'Triston', initials: 'T', winnings: 0, group: 'Footy' },
      { name: 'Lloyd Cook', initials: 'LC', winnings: 0, group: 'Footy' },
      { name: 'Henry Rayner', initials: 'HR', winnings: 0, group: 'Footy' },
      { name: 'Iain Clarke', initials: 'IC', winnings: 0, group: 'Footy' }
    ]
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getHost: (state) => {
      return state.host
    },
    getCurrentTab: (state) => {
      return state.currentTab
    },
    getDemo: (state) => {
      return state.demo
    },
    getDemoRaceFinished: (state) => {
      return state.demoRaceFinished
    },
    getWatchingBetting: (state) => {
      return state.watchingBetting
    },
    getCurrentRace: (state) => {
      const current = currentGroup(state)
      return current ? current.currentRace : -1
    },
    getRunning: (state) => {
      return state.running
    },
    getPlaying: (state) => {
      return state.playing
    },
    getPlayer1: (state) => {
      return state.player1
    },
    getPlayer2: (state) => {
      return state.player2
    },
    getPlayer3: (state) => {
      return state.player3
    },
    getPunterGroup: (state) => {
      return state.punterGroup
    },
    getGroups: (state) => {
      return state.groups
    },
    getCurrentGroup: (state) => {
      return currentGroup(state)
    },
    getPunters: (state) => {
      return state.punters.sort((a, b) => (a.name > b.name) ? 1 : -1)
    },
    getSortedPunters: (state) => {
      const punters = []
      for (let i = 0; i < state.punters.length; i++) {
        if (state.punters[i].winnings > 0) {
          punters.push(state.punters[i])
        }
      }
      return punters.sort((a, b) => (b.winnings >= a.winnings) ? 1 : -1)
    },
    getRaces: (state) => {
      const current = currentGroup(state)
      return current ? current.races : []
    },
    getEditingGroupId: (state) => {
      return state.editingGroupId
    },
    getEditingGroupPunters: (state) => {
      const current = currentEditingGroup(state)
      return current ? current.punters : []
    },
    getEditingGroupInclude: (state) => {
      const current = currentEditingGroup(state)
      return current ? current.include : {}
    }
  },
  mutations: {
    updateCurrentTab: (state, payload) => {
      state.currentTab = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
      state.demo = false
    },
    updateDemo: (state, payload) => {
      state.demo = payload
      state.host = false
    },
    updateDemoRaceFinished: (state, payload) => {
      state.demoRaceFinished = payload
    },
    updateRunning: (state, payload) => {
      state.running = payload
    },
    updatePlaying: (state, payload) => {
      state.playing = payload
    },
    updateWatchingBetting: (state, payload) => {
      state.watchingBetting = payload
    },
    updatePlayer1: (state, payload) => {
      state.player1 = payload
    },
    updatePlayer2: (state, payload) => {
      state.player2 = payload
    },
    updatePlayer3: (state, payload) => {
      state.player3 = payload
    },
    updateRaces: (state, payload) => {
      state.races = payload
    },
    updateGroups: (state, payload) => {
      state.groups = payload
      const current = state.groups.find(function(g) {
        return g.current == true
      })
      state.currentGroup = current ? current : {}
      if (current) {
        state.punters = current.punters
      }
    },
    setEditingGroupId: (state, payload) => {
      state.editingGroupId = payload
    },
    updatePunters: (state, payload) => {
      state.punters = payload
    },
    updatePigsHaveBeenShown: (state, payload) => {
      state.races[payload].pigsShown = true
    },
    updateRaceHasRun: (state, payload) => {
      state.races[payload].hasRun = true
    }
  },
  actions: {
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateCurrentTab: ({ commit }, payload) => {
      commit('updateCurrentTab', payload)
    },
    updateDemo: ({ commit }, payload) => {
      commit('updateDemo', payload)
    },
    updateDemoRaceFinished: ({ commit }, payload) => {
      commit('updateDemoRaceFinished', payload)
    },
    updateRaceHasRun: ({ commit }, payload) => {
      commit('updateRaceHasRun', payload)
    },
    updatePigsHaveBeenShown: ({ commit }, payload) => {
      commit('updatePigsHaveBeenShown', payload)
    },
    updateRunning: ({ commit }, payload) => {
      commit('updateRunning', payload)
    },
    updatePlaying: ({ commit }, payload) => {
      commit('updatePlaying', payload)
    },
    updateWatchingBetting: ({ commit }, payload) => {
      commit('updateWatchingBetting', payload)
    },
    updatePlayer1: ({ commit }, payload) => {
      commit('updatePlayer1', payload)
    },
    updatePlayer2: ({ commit }, payload) => {
      commit('updatePlayer2', payload)
    },
    updatePlayer3: ({ commit }, payload) => {
      commit('updatePlayer3', payload)
    },
    updatePunters: ({ commit }, payload) => {
      commit('updatePunters', payload)
    },
    updateRaces: ({ commit }, payload) => {
      commit('updateRaces', payload)
    },
    updateGroups: ({ commit }, payload) => {
      commit('updateGroups', payload)
    },
    setEditingGroupId: ({ commit }, payload) => {
      commit('setEditingGroupId', payload)
    }
  }
})
