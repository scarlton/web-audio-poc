class MainController
  constructor: (@$scope, @$http, channelStripFactory) ->
    @$scope.channelStrip = channelStripFactory
    @$scope.play = @play
    @$scope.stop = @stop

    @initAudioEngine()
    @buildChannelStrip()

  initAudioEngine: ->
    @$scope.audioEngine = new window.AudioContext()

    @$scope.masterFader = @$scope.audioEngine.createGain()
    @$scope.masterFader.connect(@$scope.audioEngine.destination)

  buildChannelStrip: ->
    # create audio nodes for each control
    for control in @$scope.channelStrip.controls
      switch control.type
        when 'gain'
          control.node = @$scope.audioEngine.createGain()

        when 'biquad'
          control.node = @$scope.audioEngine.createBiquadFilter()

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
        control.node.connect(@$scope.masterFader)

    @$http.get('assets/snare4.wav', responseType: 'arraybuffer').then (response) =>
      @$scope.audioEngine.decodeAudioData(response.data, @_createBufferNode)

  _createBufferNode: (buffer) =>
      @$scope.channelStrip.source.node = @$scope.audioEngine.createBufferSource()
      @$scope.channelStrip.source.node.buffer = buffer
      @$scope.channelStrip.source.node.loop = true
      @$scope.channelStrip.source.node.connect(@$scope.channelStrip.controls[0].node)

  play: =>
    @$scope.channelStrip.source.node.start(0, 0)

  stop: =>
    @$scope.channelStrip.source.node.stop(0)

angular.module('WebAudio', [])
  .controller 'MainController', ['$scope', '$http', 'channelStripFactory', MainController]