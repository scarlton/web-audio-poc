class LessonController
  constructor: (@$scope, $stateParams, channelStripFactory) ->
    @$scope.lesson = channelStripFactory.getLessonDescription($stateParams.lessonNumber)

angular.module('webAudioApp')
  .controller 'LessonController', ['$scope', '$stateParams', 'channelStripFactory', LessonController]
