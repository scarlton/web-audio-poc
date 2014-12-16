angular.module('WebAudio', [])
  .config ->
    window.requestAnimationFrame = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame
    window.AudioContext = window.AudioContext or window.webkitAudioContext