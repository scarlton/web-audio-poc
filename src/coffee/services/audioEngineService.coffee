class AudioEngineService
  volume: [-100, -100]
  volDecay: [-100, -100]
  smoothing: 0.85

  constructor: (@$rootScope, @$http, @channelStripFactory) ->
    @$rootScope.$on('play', @play)
    @$rootScope.$on('stop', @stop)

    @audioEngine = new window.AudioContext()

    @meter = @audioEngine.createScriptProcessor(4096, 2, 2)
    @meter.onaudioprocess = @_onaudioprocess
    @meter.connect(@audioEngine.destination)

    # @analyser = @audioEngine.createAnalyser()
    # @analyser.fftSize = 512
    # @analyser.connect(@audioEngine.destination)
    # @frequencyData = new Uint8Array(@analyser.frequencyBinCount)

    @masterFader = @audioEngine.createGain()
    @masterFader.connect(@meter)
    @masterFader.connect(@audioEngine.destination)

  initLesson: (lessonNumber) ->
    @_fetchSourceAudio(@channelStripFactory.getLessonSource(lessonNumber))

  buildChannelStrip: (@controls) ->
    # create audio nodes for each control
    for control in @controls
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
    for control, idx in @controls
      if idx < @controls.length - 1
        control.node.connect(@controls[idx+1].node)
      else
        # connect the last node to the mix bus
        control.node.connect(@masterFader)

    @controls

  _fetchSourceAudio: (source) ->
    @$http.get(source, responseType: 'arraybuffer').then (response) =>
      @audioEngine.decodeAudioData(response.data, @_createBufferNode)

  _createBufferNode: (buffer) =>
    @source =
      buffer: buffer

  play: =>
    @source.node = @audioEngine.createBufferSource()
    @source.node.buffer = @source.buffer
    @source.node.loop = true
    @source.node.connect(@controls[0].node)
    @source.node.start(0, 0)

    # @drawSpectrum()

  stop: =>
    @source.node.stop(0)

  # drawSpectrum: =>
  #   @analyser.getByteFrequencyData(@$scope.frequencyData)
  #   @$scope.$apply()
  #   window.requestAnimationFrame(@drawSpectrum)
  #   window.setInterval(@drawSpectrum, 10000)

  _onaudioprocess: (event) =>
    bufLength = event.inputBuffer.length
    rmsL = 0
    rmsR = 0

    leftChannel = event.inputBuffer.getChannelData(0)
    rightChannel = event.inputBuffer.getChannelData(1)

    for idx in [0...bufLength]
      rmsL += leftChannel[idx] * leftChannel[idx]
      rmsR += rightChannel[idx] * rightChannel[idx]

    rmsL = Math.sqrt(rmsL / bufLength)
    rmsR = Math.sqrt(rmsR / bufLength)

    @volDecay = [
      Math.max(@volume[0] * @smoothing, rmsL)
    ,
      Math.max(@volume[1] * @smoothing, rmsR)
    ]

    volL = 20 * (0.43429 * Math.log(@volDecay[0]))
    volR = 20 * (0.43429 * Math.log(@volDecay[1]))

    @volume = [volL, volR]
    @$rootScope.$broadcast('volume', @volume)

angular.module('webAudioApp')
  .service 'audioEngineService', ['$rootScope', '$http', 'channelStripFactory', AudioEngineService]
