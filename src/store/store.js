import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    host: false,
    currentRace: -1,
    running: false,
    playing: false,
    watchingBetting: 0,
    player1: '',
    player2: '',
    player3: '',
    punters: [
      { name: "Steve", avatar: "S", winnings: 0 },
      { name: "Fiona", avatar: "F", winnings: 0 },
      { name: "Chris", avatar: "C", winnings: 0 },
      { name: "Tony", avatar: "T", winnings: 0 },
      { name: "Jo Anne", avatar: "J", winnings: 0 },
      { name: "Rick", avatar: "R", winnings: 0 }
    ],
    races: [
      {
        name: "Race One",
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_01_1.mp4',
        pigs: [
          { name: "Perky", bets: [], place: 2 },
          { name: "Babe", bets: [], place: 0 },
          { name: "Curly", bets: [], place: 0 },
          { name: "Pinky", bets: [], place: 1 },
          { name: "Chops", bets: [], place: 0 },
          { name: "Cheeky", bets: [], place: 3 },
          { name: "Pygmy", bets: [], place: 0 },
          { name: "Tom Trotter", bets: [], place: 4 }
        ]
      },
      {
        name: "Race Two",
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_02_1.mp4',
        pigs: [
          { name: "Streaky Bob", bets: [], place: 4 },
          { name: "Bursting To Go", bets: [], place: 0 },
          { name: "Muck For Luck", bets: [], place: 0 },
          { name: "Big Willy", bets: [], place: 2 },
          { name: "Lester Piglet", bets: [], place: 1 },
          { name: "Hog Wart", bets: [], place: 0 },
          { name: "Mr Swilly", bets: [], place: 3 },
          { name: "Smell Your Mam", bets: [], place: 0 }
        ]
      },
      {
        name: "Race Three",
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_03_1.mp4',
        pigs: [
          { name: "Jake The Pig", bets: [], place: 0 },
          { name: "Danish Delight", bets: [], place: 4 },
          { name: "Odour Eater", bets: [], place: 0 },
          { name: "Super Stud", bets: [], place: 2 },
          { name: "Wind Breaker", bets: [], place: 1 },
          { name: "Pie In The Sky", bets: [], place: 3 },
          { name: "Pig'n About", bets: [], place: 0 },
          { name: "Ugly Chops", bets: [], place: 0 }
        ]
      },
      {
        name: "Race Four",
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_04_1.mp4',
        pigs: [
          { name: "Pig Tail", bets: [], place: 0 },
          { name: "Piggy Back", bets: [], place: 0 },
          { name: "Special Offer", bets: [], place: 2 },
          { name: "Smokey Joe", bets: [], place: 0 },
          { name: "Nyree Dawn Porker", bets: [], place: 0 },
          { name: "Douglas Hog", bets: [], place: 4 },
          { name: "Sunday Special", bets: [], place: 1 },
          { name: "Jobby", bets: [], place: 3 }
        ]
      },
      {
        name: "Race Five",
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_05_1.mp4',
        pigs: [
          { name: "Apple Sauce", bets: [], place: 0 },
          { name: "Rocky", bets: [], place: 3 },
          { name: "The Flying Pig", bets: [], place: 4 },
          { name: "Skoda", bets: [], place: 0 },
          { name: "Shih Tzu", bets: [], place: 0 },
          { name: "Porcupine", bets: [], place: 0 },
          { name: "Super Stud", bets: [], place: 2 },
          { name: "Double Blank", bets: [], place: 1 }
        ]
      },
      {
        name: "Race Six",
        include: true,
        pigsShown: false,
        hasRun: false,
        video: 'VTS_06_1.mp4',
        pigs: [
          { name: "Stew Pot", bets: [], place: 3 },
          { name: "Walters Plodder", bets: [], place: 2 },
          { name: "Hog Wash", bets: [], place: 0 },
          { name: "Miss Piggy", bets: [], place: 1 },
          { name: "Snorter", bets: [], place: 4 },
          { name: "Piggy Malone", bets: [], place: 0 },
          { name: "Lester Piglet", bets: [], place: 0 },
          { name: "Lynford Crispy Bacon", bets: [], place: 0 }
        ]
      },
      {
        name: "Race Seven",
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race SEVEN.mp4',
        pigs: [
          { name: "Air Fungus", bets: [], place: 0 },
          { name: "Duty Free", bets: [], place: 0 },
          { name: "Flying Officer Kite", bets: [], place: 0 },
          { name: "Free Insurance", bets: [], place: 0 },
          { name: "Never On Time", bets: [], place: 0 },
          { name: "Full Board", bets: [], place: 0 },
          { name: "Not Quite Finished", bets: [], place: 0 },
          { name: "Trolley Dolley", bets: [], place: 0 }
        ]
      },
      {
        name: "Race Eight",
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race EIGHT.mp4',
        pigs: [
          { name: "Rasher Dasher", bets: [], place: 0 },
          { name: "Shortts Snorter", bets: [], place: 0 },
          { name: "Tony's Trotter", bets: [], place: 0 },
          { name: "Pork Scratchings", bets: [], place: 0 },
          { name: "Trotsky", bets: [], place: 0 },
          { name: "Squealer", bets: [], place: 0 },
          { name: "Kelly's Porker", bets: [], place: 0 },
          { name: "Smokey Bacon", bets: [], place: 0 },
        ]
      },
      {
        name: "Race Nine",
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race NINE.mp4',
        pigs: [
          { name: "Domestos", bets: [], place: 0 },
          { name: "Oprah", bets: [], place: 0 },
          { name: "Lost In France", bets: [], place: 0 },
          { name: "Angus Mi Coat Up", bets: [], place: 0 },
          { name: "U Want Fork", bets: [], place: 0 },
          { name: "Nice One Cyril", bets: [], place: 0 },
          { name: "Nyrene Dawn Porker", bets: [], place: 0 },
          { name: "Reebok", bets: [], place: 0 }
        ]
      },
      {
        name: "Race Ten",
        include: false,
        pigsShown: false,
        hasRun: false,
        video: 'Race TEN.mp4',
        pigs: [
          { name: "Lady Godiva", bets: [], place: 0 },
          { name: "Wind Breaker", bets: [], place: 0 },
          { name: "Big Ben", bets: [], place: 0 },
          { name: "Dole Money", bets: [], place: 0 },
          { name: "Domino King", bets: [], place: 0 },
          { name: "Carling Darling", bets: [], place: 0 },
          { name: "Cook The Books", bets: [], place: 0 },
          { name: "Pile On The Track", bets: [], place: 0 }
        ]
      }
    ]
  },
  getters: {
    getHost: (state) => {
      return state.host;
    },
    getWatchingBetting: (state) => {
      return state.watchingBetting;
    },
    getCurrentRace: (state) => {
      return state.currentRace;
    },
    getRunning: (state) => {
      return state.running;
    },
    getPlaying: (state) => {
      return state.playing;
    },
    getPlayer1: (state) => {
      return state.player1;
    },
    getPlayer2: (state) => {
      return state.player2;
    },
    getPlayer3: (state) => {
      return state.player3;
    },
    getPunters: (state) => {
      return state.punters;
    },
    getRaces: (state) => {
      return state.races;
    }
  },
  mutations: {
    updateHost: (state, payload) => {
      state.host = payload;
    },
    updateCurrentRace: (state, payload) => {
      state.currentRace = payload;
    },
    updateRunning: (state, payload) => {
      state.running = payload;
    },
    updatePlaying: (state, payload) => {
      state.playing = payload;
    },
    updateWatchingBetting: (state, payload) => {
      if (payload == "add") {
        state.watchingBetting = state.watchingBetting + 1;
      } else {
        state.watchingBetting = state.watchingBetting - 1;
      }
    },
    updatePlayer1: (state, payload) => {
      state.player1 = payload;
    },
    updatePlayer2: (state, payload) => {
      state.player2 = payload;
    },
    updatePlayer3: (state, payload) => {
      state.player3 = payload;
    },
    updatePunters: (state, payload) => {
      state.punters = payload;
    },
    updatePigsHaveBeenShown: (state, payload) => {
      state.races[payload].pigsShown = true;
    },
    updateRaceHasRun: (state, payload) => {
      state.races[payload].hasRun = true;
    }
  },
  actions: {
    updateHost: ({ commit }, payload) => {
      commit("updateHost", payload);
    },
    updateCurrentRace: ({ commit }, payload) => {
      commit("updateCurrentRace", payload);
    },
    updateRaceHasRun: ({ commit }, payload) => {
      commit("updateRaceHasRun", payload);
    },
    updatePigsHaveBeenShown: ({ commit }, payload) => {
      commit("updatePigsHaveBeenShown", payload);
    },
    updateRunning: ({ commit }, payload) => {
      commit("updateRunning", payload);
    },
    updatePlaying: ({ commit }, payload) => {
      commit("updatePlaying", payload);
    },
    updateWatchingBetting: ({ commit }, payload) => {
      commit("updateWatchingBetting", payload);
    },
    updatePlayer1: ({ commit }, payload) => {
      commit("updatePlayer1", payload);
    },
    updatePlayer2: ({ commit }, payload) => {
      commit("updatePlayer2", payload);
    },
    updatePlayer3: ({ commit }, payload) => {
      commit("updatePlayer3", payload);
    },
    updatePunters: ({ commit }, payload) => {
      commit("updatePunters", payload);
    }
  }
});
