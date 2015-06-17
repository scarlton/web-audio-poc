angular.module('webAudioApp')
  .constant 'EQ_TYPES',
    TWOBAND: [
        name: 'HF'
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
        name: 'LF'
        type: 'biquad'
        parameters:
          type: 'lowshelf'
          frequency: 80
          gain: 0
        limits:
          gain:
            max: 15
            min: -15
    ]

    THREEBAND: [
        name: 'HF'
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
        name: 'MF'
        type: 'biquad'
        parameters:
          type: 'peaking'
          frequency: 4000
          gain: 0
          q: 1.414
        limits:
          gain:
            max: 15
            min: -15
      ,
        name: 'LF'
        type: 'biquad'
        parameters:
          type: 'lowshelf'
          frequency: 80
          gain: 0
        limits:
          gain:
            max: 15
            min: -15
    ]

    THREEBANDSEMIPARAMETRIC: [
        name: 'HF'
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
        name: 'MF'
        type: 'biquad'
        parameters:
          type: 'peaking'
          frequency: 4000
          gain: 0
          q: 1.414
        limits:
          gain:
            max: 15
            min: -15
          frequency:
            max: 15000
            min: 500
      ,
        name: 'LF'
        type: 'biquad'
        parameters:
          type: 'lowshelf'
          frequency: 80
          gain: 0
        limits:
          gain:
            max: 15
            min: -15
    ]

    FOURBANDSEMIPARAMETRIC: [
        name: 'HF'
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
        name: 'HM'
        type: 'biquad'
        parameters:
          type: 'peaking'
          frequency: 3000
          gain: 0
          Q: 1.414
        limits:
          gain:
            max: 15
            min: -15
          frequency:
            max: 15000
            min: 500
      ,
        name: 'LM'
        type: 'biquad'
        parameters:
          type: 'peaking'
          frequency: 180
          gain: 0
          Q: 1.414
        limits:
          gain:
            max: 15
            min: -15
          frequency:
            max: 1000
            min: 35
      ,
        name: 'LF'
        type: 'biquad'
        parameters:
          type: 'lowshelf'
          frequency: 80
          gain: 0
        limits:
          gain:
            max: 15
            min: -15
    ]
