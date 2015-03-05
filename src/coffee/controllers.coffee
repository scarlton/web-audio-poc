class MainController
  constructor: (@$scope, @$http, channelStripFactory) ->
    @$scope.channelStrip = channelStripFactory
    @$scope.$on('play', @play)
    @$scope.$on('stop', @stop)
    # @$scope.reset = @reset

    @initAudioEngine()
    @buildChannelStrip()

  initAudioEngine: ->
    @audioEngine = new window.AudioContext()

    @masterFader = @audioEngine.createGain()
    @masterFader.connect(@audioEngine.destination)

  buildChannelStrip: ->
    # create audio nodes for each control
    for control in @$scope.channelStrip.controls
      switch control.type
        when 'gain'
          control.node = @audioEngine.createGain()

        when 'biquad'
          control.node = @audioEngine.createBiquadFilter()

      # fill in default parameters from the factory object
      for own param, value of control.parameters
        if param is 'type'
          control.node.type = value
        else
          control.node[param].value = value

    # connect each node in series
    for control, idx in @$scope.channelStrip.controls
      if idx < @$scope.channelStrip.controls.length - 1
        control.node.connect(@$scope.channelStrip.controls[idx+1].node)
      else
        # connect the last node to the mix bus
        control.node.connect(@masterFader)

    @$http.get(@$scope.channelStrip.source.file, responseType: 'arraybuffer').then (response) =>
      @audioEngine.decodeAudioData(response.data, @_createBufferNode)

  _createBufferNode: (buffer) =>
    @$scope.channelStrip.source.buffer = buffer

  play: =>
    @$scope.channelStrip.source.node = @audioEngine.createBufferSource()
    @$scope.channelStrip.source.node.buffer = @$scope.channelStrip.source.buffer
    @$scope.channelStrip.source.node.loop = true
    @$scope.channelStrip.source.node.connect(@$scope.channelStrip.controls[0].node)
    @$scope.channelStrip.source.node.start(0, 0)

  stop: =>
    @$scope.channelStrip.source.node.stop(0)

  reset: =>
    for control in @$scope.channelStrip.controls
      for own param, value of control.parameters
        if param is 'type'
          control.node.type = value
        else
          control.node[param].value = value



class TransportController
  constructor: (@$scope, @transportService) ->
    @$scope.isPlaying = false
    @$scope.play = @play
    @$scope.stop = @stop

  play: =>
    @transportService.play()
    @$scope.isPlaying = true

  stop: =>
    @transportService.stop()
    @$scope.isPlaying = false



angular.module('webAudioApp')
  .controller 'MainController', ['$scope', '$http', 'channelStripFactory', MainController]
  .controller 'TransportController', ['$scope', 'transportService', TransportController]