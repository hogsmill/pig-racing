
var Video = {

  setTestVideo: function() {
    var video = document.getElementById('video')
    video.src = "http://agilesimulations.co.uk/pig-racing/video/TestVideo.mp4"
    video.load()
  },
  loadVideo: function(race) {
    var video = document.getElementById('video')
    video.src = "http://agilesimulations.co.uk/pig-racing/video/" + race.video
    video.load()
  },
  setVideoTime: function(t) {
    var video = document.getElementById('video')
    video.currentTime = t
  },
  playVideo: function() {
    var video = document.getElementById('video')
    video.play()
  },
  pauseVideo: function() {
    var video = document.getElementById('video')
    video.pause()
  },
  pauseVideoAt: function(n) {
    var timeUpdateFunction = function() {
      if (this.currentTime >= n) {
          this.pause();
          this.removeEventListener("timeupdate",timeUpdateFunction);
      }
    }
    var video = document.getElementById('video')
    video.addEventListener("timeupdate", timeUpdateFunction)
  }
}

export default Video
