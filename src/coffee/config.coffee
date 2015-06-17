Config = ($stateProvider, $urlRouterProvider) ->
  window.requestAnimationFrame = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame
  window.AudioContext = window.AudioContext or window.webkitAudioContext

  $urlRouterProvider.otherwise('/eq/1')

  $stateProvider.state 'eq',
    url: '/eq/:lessonNumber'
    views:
      sidebar:
        controller: 'LessonController'
        templateUrl: 'templates/sidebar.html'

      transport:
        controller: 'TransportController'
        templateUrl: 'templates/transport.html'

      mixarea:
        controller: 'EqController'
        templateUrl: 'templates/eq.html'


angular.module('webAudioApp')
  .config(['$stateProvider', '$urlRouterProvider', Config])
