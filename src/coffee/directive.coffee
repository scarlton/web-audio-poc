knob = ->
  link: (scope, elem, attrs) ->
    elem.bind 'click', ->
      console.log scope.thing
  restrict: 'AE'
  scope: true
  template: '<h3>Hello World!!</h3>'

angular.module('webAudioApp')
  .directive('knob', knob)