<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="https://agilesimulations.co.uk">
      <img src="/lego.png" class="ml-4" height="38px">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" :class="{ active: currentTab == 'racing' }">
          <a class="nav-link pointer" @click="updateTab('racing')">Game</a>
        </li>
        <li v-if="isHost" class="nav-item" :class="{ active: currentTab == 'setup' }">
          <a class="nav-link pointer" @click="updateTab('setup')">Set Up</a>
        </li>
        <li class="nav-item">
          <a class="nav-link pointer" @click="show('feedback')">Feedback</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import mailFuns from '../lib/mail.js'

export default {
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    isHost() {
      return this.$store.getters.getHost
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    }
  },
  methods: {
    updateTab(tab) {
      this.$store.dispatch('updateCurrentTab', tab)
    },
    updateShowFacilitator(payload) {
      this.$store.dispatch('updateShowFacilitator', payload)
    },
    show(modal) {
      this.$store.dispatch('showModal', modal)
    },
    sendFeedback() {
      mailFuns.post({
        action: 'Feedback from ' + this.thisGame,
        email: encodeURIComponent(document.getElementById('email').value),
        comments: encodeURIComponent(document.getElementById('comments').value)
        },
        'Thanks for your feedback - we appreciate it!',
        'feedback'
      )
    }
  },
}
</script>

<style>
  .feedback {
    letter-spacing: 0;
    color: #212529;
  }

  p.feedback-form {
    margin-bottom: 12px;
  }

  .feedback-form {
    width: 80%;
    margin: 0 auto;
  }
</style>
