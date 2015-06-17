class TransportService
  constructor: (@$rootScope) ->

  play: =>
    @$rootScope.$broadcast('play')

  stop: =>
    @$rootScope.$broadcast('stop')

angular.module('webAudioApp')
  .service 'transportService', ['$rootScope', TransportService]