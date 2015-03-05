Config = ($stateProvider, $urlRouterProvider) ->
  window.requestAnimationFrame = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame
  window.AudioContext = window.AudioContext or window.webkitAudioContext

  $urlRouterProvider.otherwise('/main')

  $stateProvider.state 'main',
    url: '/main'
    views:
      'sidebar':
        templateUrl: 'templates/sidebar.html'

      'transport':
        templateUrl: 'templates/transport.html'
        controller: 'TransportController'

      'mixarea':
        templateUrl: 'templates/mixarea.html'
        controller: 'MainController'


angular.module('webAudioApp')
  .config(['$stateProvider', '$urlRouterProvider', Config])