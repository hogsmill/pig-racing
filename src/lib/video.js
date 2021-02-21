
const Video = {

  setTestVideo: function() {
    const video = document.getElementById('video')
    video.src = 'https://agilesimulations.co.uk/pig-racing/video/TestVideo.mp4'
    video.load()
  },
  loadVideo: function(race) {
    const video = document.getElementById('video')
    video.src = 'https://agilesimulations.co.uk/pig-racing/video/' + race.video
    video.load()
  },
  setVideoTime: function(t) {
    const video = document.getElementById('video')
    video.currentTime = t
  },
  playVideo: function() {
    const video = document.getElementById('video')
    video.play()
  },
  pauseVideo: function() {
    const video = document.getElementById('video')
    video.pause()
  },
  pauseVideoAt: function(n, socket, groupId) {
    const timeUpdateFunction = function() {
      if (this.currentTime >= n) {
          this.pause()
          socket.emit('watching', {groupId: groupId, field: 'betting', watching: false})
          this.removeEventListener('timeupdate',timeUpdateFunction)
      }
    }
    const video = document.getElementById('video')
    video.addEventListener('timeupdate', timeUpdateFunction)
  }

}

export default Video
