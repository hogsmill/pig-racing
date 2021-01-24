import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    host: false,
    demo: false,
    demoRaceFinished: false,
    currentRace: -1,
    running: false,
    playing: false,
    watchingBetting: 0,
    player1: '',
    player2: '',
    player3: '',
    punterGroup: 'Footy',
    avatarType: 'initials',
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
      { name: 'Iain Clarke', initials: 'IC', winnings: 0, group: 'Footy' },

      { name: 'Guest One', initials: 'G1', winnings: 0, group: 'Footy' },
      { name: 'Guest Two', initials: 'G2', winnings: 0, group: 'Footy' },
      { name: 'Guest Three', initials: 'G3', winnings: 0, group: 'Footy' },
      { name: 'Guest Four', initials: 'G4', winnings: 0, group: 'Footy' },
      { name: 'Guest Five', initials: 'G5', winnings: 0, group: 'Footy' }


    ],
    races: [
      {
        name: 'Race One',
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_01_1.mp4',
        pigs: [
          { name: 'Perky', bets: [], place: 2 },
          { name: 'Babe', bets: [], place: 0 },
          { name: 'Curly', bets: [], place: 0 },
          { name: 'Pinky', bets: [], place: 1 },
          { name: 'Chops', bets: [], place: 0 },
          { name: 'Cheeky', bets: [], place: 3 },
          { name: 'Pygmy', bets: [], place: 0 },
          { name: 'Tom Trotter', bets: [], place: 4 }
        ]
      },
      {
        name: 'Race Two',
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_02_1.mp4',
        pigs: [
          { name: 'Streaky Bob', bets: [], place: 4 },
          { name: 'Bursting To Go', bets: [], place: 0 },
          { name: 'Muck For Luck', bets: [], place: 0 },
          { name: 'Big Willy', bets: [], place: 2 },
          { name: 'Lester Piglet', bets: [], place: 1 },
          { name: 'Hog Wart', bets: [], place: 0 },
          { name: 'Mr Swilly', bets: [], place: 3 },
          { name: 'Smell Your Mam', bets: [], place: 0 }
        ]
      },
      {
        name: 'Race Three',
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_03_1.mp4',
        pigs: [
          { name: 'Jake The Pig', bets: [], place: 0 },
          { name: 'Danish Delight', bets: [], place: 4 },
          { name: 'Odour Eater', bets: [], place: 0 },
          { name: 'Super Stud', bets: [], place: 2 },
          { name: 'Wind Breaker', bets: [], place: 1 },
          { name: 'Pie In The Sky', bets: [], place: 3 },
          { name: 'Pig\'n About', bets: [], place: 0 },
          { name: 'Ugly Chops', bets: [], place: 0 }
        ]
      },
      {
        name: 'Race Four',
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_04_1.mp4',
        pigs: [
          { name: 'Pig Tail', bets: [], place: 0 },
          { name: 'Piggy Back', bets: [], place: 0 },
          { name: 'Special Offer', bets: [], place: 2 },
          { name: 'Smokey Joe', bets: [], place: 0 },
          { name: 'Nyree Dawn Porker', bets: [], place: 0 },
          { name: 'Douglas Hog', bets: [], place: 4 },
          { name: 'Sunday Special', bets: [], place: 1 },
          { name: 'Jobby', bets: [], place: 3 }
        ]
      },
      {
        name: 'Race Five',
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_05_1.mp4',
        pigs: [
          { name: 'Apple Sauce', bets: [], place: 0 },
          { name: 'Rocky', bets: [], place: 3 },
          { name: 'The Flying Pig', bets: [], place: 4 },
          { name: 'Skoda', bets: [], place: 0 },
          { name: 'Shih Tzu', bets: [], place: 0 },
          { name: 'Porcupine', bets: [], place: 0 },
          { name: 'Super Stud', bets: [], place: 2 },
          { name: 'Double Blank', bets: [], place: 1 }
        ]
      },
      {
        name: 'Race Six',
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_06_1.mp4',
        pigs: [
          { name: 'Stew Pot', bets: [], place: 3 },
          { name: 'Walters Plodder', bets: [], place: 2 },
          { name: 'Hog Wash', bets: [], place: 0 },
          { name: 'Miss Piggy', bets: [], place: 1 },
          { name: 'Snorter', bets: [], place: 4 },
          { name: 'Piggy Malone', bets: [], place: 0 },
          { name: 'Lester Piglet', bets: [], place: 0 },
          { name: 'Lynford Crispy Bacon', bets: [], place: 0 }
        ]
      },
      {
        name: 'Race Seven',
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race SEVEN.mp4',
        pigs: [
          { name: 'Air Fungus', bets: [], place: 0 },
          { name: 'Duty Free', bets: [], place: 0 },
          { name: 'Flying Officer Kite', bets: [], place: 0 },
          { name: 'Free Insurance', bets: [], place: 0 },
          { name: 'Never On Time', bets: [], place: 0 },
          { name: 'Full Board', bets: [], place: 0 },
          { name: 'Not Quite Finished', bets: [], place: 0 },
          { name: 'Trolley Dolley', bets: [], place: 0 }
        ]
      },
      {
        name: 'Race Eight',
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race EIGHT.mp4',
        pigs: [
          { name: 'Rasher Dasher', bets: [], place: 0 },
          { name: 'Shortts Snorter', bets: [], place: 0 },
          { name: 'Tony\'s Trotter', bets: [], place: 0 },
          { name: 'Pork Scratchings', bets: [], place: 0 },
          { name: 'Trotsky', bets: [], place: 0 },
          { name: 'Squealer', bets: [], place: 0 },
          { name: 'Kelly\'s Porker', bets: [], place: 0 },
          { name: 'Smokey Bacon', bets: [], place: 0 },
        ]
      },
      {
        name: 'Race Nine',
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race NINE.mp4',
        pigs: [
          { name: 'Domestos', bets: [], place: 0 },
          { name: 'Oprah', bets: [], place: 0 },
          { name: 'Lost In France', bets: [], place: 0 },
          { name: 'Angus Mi Coat Up', bets: [], place: 0 },
          { name: 'U Want Fork', bets: [], place: 0 },
          { name: 'Nice One Cyril', bets: [], place: 0 },
          { name: 'Nyrene Dawn Porker', bets: [], place: 0 },
          { name: 'Reebok', bets: [], place: 0 }
        ]
      },
      {
        name: 'Race Ten',
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race TEN.mp4',
        pigs: [
          { name: 'Lady Godiva', bets: [], place: 0 },
          { name: 'Wind Breaker', bets: [], place: 0 },
          { name: 'Big Ben', bets: [], place: 0 },
          { name: 'Dole Money', bets: [], place: 0 },
          { name: 'Domino King', bets: [], place: 0 },
          { name: 'Carling Darling', bets: [], place: 0 },
          { name: 'Cook The Books', bets: [], place: 0 },
          { name: 'Pile On The Track', bets: [], place: 0 }
        ]
      }
    ]
  },
  getters: {
    getHost: (state) => {
      return state.host
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
      return state.currentRace
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
      return state.races
    }
  },
  mutations: {
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
    updateCurrentRace: (state, payload) => {
      state.currentRace = payload
    },
    updateRunning: (state, payload) => {
      state.running = payload
    },
    updatePlaying: (state, payload) => {
      state.playing = payload
    },
    updateWatchingBetting: (state, payload) => {
      if (payload == 'add') {
        state.watchingBetting = state.watchingBetting + 1
      } else {
        state.watchingBetting = state.watchingBetting - 1
      }
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
    updateDemo: ({ commit }, payload) => {
      commit('updateDemo', payload)
    },
    updateDemoRaceFinished: ({ commit }, payload) => {
      commit('updateDemoRaceFinished', payload)
    },
    updateCurrentRace: ({ commit }, payload) => {
      commit('updateCurrentRace', payload)
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
    }
  }
})
