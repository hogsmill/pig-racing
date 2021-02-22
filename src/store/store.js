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
    watchingBetting: false,
    quiz: false,
    quizConfig: {},
    slides: [],
    watching: {
      betting: 0,
      racing: 0
    },
    player1: {},
    player2: {},
    player3: {},
    punterGroup: 'Footy',
    avatarType: 'initials',
    groups: [],
    editingGroupId: null,
    punters: []
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
    getWatching: (state) => {
      return state.watching
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
    getCombineScores: (state) => {
      const current = currentGroup(state)
      return current.combineScores
    },
    getQuiz: (state) => {
      return state.quiz
    },
    getNoOfRounds: (state) => {
      const current = currentGroup(state)
      return current ? current.quizConfig.rounds.length : 0
    },
    getCurrentRound: (state) => {
      const current = currentGroup(state)
      return current ? current.quizConfig.rounds[current.quizConfig.round - 1] : []
    },
    getCurrentRoundNumber: (state) => {
      const current = currentGroup(state)
      return current.quizConfig.round
    },
    getCurrentSlide: (state) => {
      const current = currentGroup(state)
      return current ? current.quizConfig.rounds[current.quizConfig.round - 1][current.quizConfig.slide - 1] : {}
    },
    getCurrentSlideNumber: (state) => {
      const current = currentGroup(state)
      return current.quizConfig.slide
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
    getSlides: (state) => {
      return state.slides
    },
    getCurrentGroup: (state) => {
      return currentGroup(state)
    },
    getMaxPunters: (state) => {
      const group = currentGroup(state)
      return group ? group.maxPunters : null
    },
    getPunters: (state) => {
      return state.punters.sort((a, b) => (a.name > b.name) ? 1 : -1)
    },
    getRaceSortedPunters: (state) => {
      const punters = []
      for (let i = 0; i < state.punters.length; i++) {
        if (state.punters[i].winnings > 0) {
          punters.push(state.punters[i])
        }
      }
      return punters.sort((a, b) => (b.winnings >= a.winnings) ? 1 : -1)
    },
    getQuizSortedPunters: (state) => {
      const punters = []
      for (let i = 0; i < state.punters.length; i++) {
        if (state.punters[i].quizScore > 0) {
          punters.push(state.punters[i])
        }
      }
      return punters.sort((a, b) => (b.quizScore >= a.quizScore) ? 1 : -1)
    },
    getBothSortedPunters: (state) => {
      const punters = []
      for (let i = 0; i < state.punters.length; i++) {
        if (state.punters[i].winnings > 0 || state.punters[i].quizScore > 0) {
          punters.push(state.punters[i])
        }
      }
      return punters.sort(function(a, b) {
        const scoreA = (a.winnings ? a.winnings : 0) + (a.quizScore ? a.quizScore : 0)
        const scoreB = (b.winnings ? b.winnings : 0) + (b.quizScore ? b.quizScore : 0)
        return scoreB >= scoreA ? 1 : -1
      })
    },
    getRaces: (state) => {
      const current = currentGroup(state)
      return current ? current.races : []
    },
    getDoublePointsOnLastRace: (state) => {
      const current = currentGroup(state)
      return current ? current.doublePointsOnLastRace : []
    },
    getEditingGroupId: (state) => {
      return state.editingGroupId
    },
    getEditingGroupPunters: (state) => {
      const current = currentEditingGroup(state)
      return current ? current.punters : []
    },
    getEditingGroupQuiz: (state) => {
      const current = currentEditingGroup(state)
      return current && current.quizConfig ? current.quizConfig : {}
    },
    getEditingGroupInclude: (state) => {
      const current = currentEditingGroup(state)
      return current ? current.include : {}
    },
    getEditingGroupMaxPunters: (state) => {
      const current = currentEditingGroup(state)
      return current ? current.maxPunters : null
    },
    getNoOfSelectedSlides: (state) => {
      const current = currentEditingGroup(state)
      let n = 0
      if (current.quizConfig) {
        for (let i = 0; i < current.quizConfig.rounds.length; i++) {
          n = n + current.quizConfig.rounds[i].length
        }
      }
      return n
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
    updateWatching: (state, payload) => {
      state.watching = payload
    },
    updateWatchingBetting: (state, payload) => {
      state.watchingBetting = payload
    },
    showQuizRound: (state, payload) => {
      state.quiz = payload
    },
    setQuizSlide: (state, payload) => {
      state.slide = payload
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
    },
    updateSlides: (state, payload) => {
      state.slides = payload
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
    updateWatching: ({ commit }, payload) => {
      commit('updateWatching', payload)
    },
    updateWatchingBetting: ({ commit }, payload) => {
      commit('updateWatchingBetting', payload)
    },
    showQuizRound: ({ commit }, payload) => {
      commit('showQuizRound', payload)
    },
    setQuizSlide: ({ commit }, payload) => {
      commit('setQuizSlide', payload)
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
    },
    updateSlides: ({ commit }, payload) => {
      commit('updateSlides', payload)
    },
  }
})
