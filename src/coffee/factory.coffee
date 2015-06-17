lessonSourceMap = [
  'assets/kick4.wav'
  'assets/snare4.wav'
]

lessonDescriptionMap = [
  name: 'Kick'
  description: ''
  objective: ''
,
  name: 'Introduction to EQ'
  description: """
An equalizer is an important tool for an audio engineer - it adjusts the tone of a sound. If you've ever turned the "Bass" and "Treble" knobs on a car stereo or guitar amp, you've used a very simple EQ before.
It is very important for an engineer to be able to control the tonal quality of a sound because people can only hear a limited range of frequencies. It is commonly said that our hearing range is only between 20 Hertz and 20,000 Hertz, and in reality when you are mixing you probably will only deal with a small section of those frequencies. So when sounds are too loud or too quiet at certain frequencies they can sound "thin" or "muddy", or it can make it harder to hear one instrument if another instrument is playing too loud in the same frequency range. Every instrument needs its own "space" in the audio spectrum.
"""
  objective: 'This snare track doesn\'t hit the way it should. Let\'s give it some punch in the low mids.'
  objectiveList: ['Adjust the mid frequency band to make this snare track cut through the mix.']

]

channelStripFactory = ->
  getLessonSource: (lessonNumber) ->
    lessonSourceMap[lessonNumber]

  getLessonDescription: (lessonNumber) ->
    lessonDescriptionMap[lessonNumber]

angular.module('webAudioApp')
  .factory('channelStripFactory', channelStripFactory)
