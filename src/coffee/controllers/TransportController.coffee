class TransportController
  constructor: (@$scope, @audioEngineService) ->
    @$scope.isPlaying = false
    @$scope.play = @play
    @$scope.stop = @stop
    @$scope.volume = @audioEngineService.volume
    @$scope.$on('volume', @onVolume)

  play: =>
    @audioEngineService.play()
    @$scope.isPlaying = true

  stop: =>
    @audioEngineService.stop()
    @$scope.isPlaying = false

  onVolume: (event, volume) =>
    volume[0] = -100 if volume[0] < -100
    volume[1] = -100 if volume[1] < -100

    unless volume is @$scope.volume
      @$scope.volume = volume
      requestAnimationFrame(=> @$scope.$apply())


angular.module('webAudioApp')
  .controller 'TransportController', ['$scope', 'audioEngineService', TransportController]