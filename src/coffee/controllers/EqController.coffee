class EqController
  constructor: (@$scope, $stateParams, audioEngineService, EQ_TYPES) ->
    audioEngineService.initLesson($stateParams.lessonNumber)
    @$scope.channelStrip = audioEngineService.buildChannelStrip(EQ_TYPES.THREEBAND)

  reset: =>
    for control in @$scope.channelStrip.controls
      for own param, value of control.parameters
        if param is 'type'
          control.node.type = value
        else
          control.node[param].value = value


angular.module('webAudioApp')
  .controller 'EqController', ['$scope', '$stateParams', 'audioEngineService', 'EQ_TYPES', EqController]
