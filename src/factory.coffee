angular.module('WebAudio').factory 'channelStripFactory', ->
  source: {}
  controls: [
      name: 'Input gain'
      type: 'gain'
      parameters:
        gain: 1
    ,
      name: 'HI'
      type: 'biquad'
      parameters:
        type: 'highshelf'
        frequency: 12000
        gain: 0
      limits:
        gain:
          max: 15
          min: -15
    ,
      name: 'MID'
      type: 'biquad'
      parameters:
        type: 'peaking'
        frequency: 2500
        gain: 0
        Q: 1.414
      limits:
        gain:
          max: 15
          min: -15
        frequency:
          max: 8000
          min: 100
    ,
      name: 'LOW'
      type: 'biquad'
      parameters:
        type: 'lowshelf'
        frequency: 80
        gain: 0
      limits:
        gain:
          max: 15
          min: -15
    ,
      name: 'Fader'
      type: 'gain'
      parameters:
        gain: 1
  ]