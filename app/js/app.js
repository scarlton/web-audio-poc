angular.module('webAudioApp', ['ui.router']);

var Config;

Config = function($stateProvider, $urlRouterProvider) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  $urlRouterProvider.otherwise('/main');
  return $stateProvider.state('main', {
    url: '/main',
    views: {
      'sidebar': {
        templateUrl: 'templates/sidebar.html'
      },
      'transport': {
        templateUrl: 'templates/transport.html',
        controller: 'TransportController'
      },
      'mixarea': {
        templateUrl: 'templates/mixarea.html',
        controller: 'MainController'
      }
    }
  });
};

angular.module('webAudioApp').config(['$stateProvider', '$urlRouterProvider', Config]);

var MainController, TransportController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty;

MainController = (function() {
  function MainController(_at_$scope, _at_$http, channelStripFactory) {
    this.$scope = _at_$scope;
    this.$http = _at_$http;
    this.reset = __bind(this.reset, this);
    this.stop = __bind(this.stop, this);
    this.play = __bind(this.play, this);
    this._createBufferNode = __bind(this._createBufferNode, this);
    this.$scope.channelStrip = channelStripFactory;
    this.$scope.$on('play', this.play);
    this.$scope.$on('stop', this.stop);
    this.initAudioEngine();
    this.buildChannelStrip();
  }

  MainController.prototype.initAudioEngine = function() {
    this.audioEngine = new window.AudioContext();
    this.masterFader = this.audioEngine.createGain();
    return this.masterFader.connect(this.audioEngine.destination);
  };

  MainController.prototype.buildChannelStrip = function() {
    var control, idx, param, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    _ref = this.$scope.channelStrip.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      switch (control.type) {
        case 'gain':
          control.node = this.audioEngine.createGain();
          break;
        case 'biquad':
          control.node = this.audioEngine.createBiquadFilter();
      }
      _ref1 = control.parameters;
      for (param in _ref1) {
        if (!__hasProp.call(_ref1, param)) continue;
        value = _ref1[param];
        if (param === 'type') {
          control.node.type = value;
        } else {
          control.node[param].value = value;
        }
      }
    }
    _ref2 = this.$scope.channelStrip.controls;
    for (idx = _j = 0, _len1 = _ref2.length; _j < _len1; idx = ++_j) {
      control = _ref2[idx];
      if (idx < this.$scope.channelStrip.controls.length - 1) {
        control.node.connect(this.$scope.channelStrip.controls[idx + 1].node);
      } else {
        control.node.connect(this.masterFader);
      }
    }
    return this.$http.get(this.$scope.channelStrip.source.file, {
      responseType: 'arraybuffer'
    }).then((function(_this) {
      return function(response) {
        return _this.audioEngine.decodeAudioData(response.data, _this._createBufferNode);
      };
    })(this));
  };

  MainController.prototype._createBufferNode = function(buffer) {
    return this.$scope.channelStrip.source.buffer = buffer;
  };

  MainController.prototype.play = function() {
    this.$scope.channelStrip.source.node = this.audioEngine.createBufferSource();
    this.$scope.channelStrip.source.node.buffer = this.$scope.channelStrip.source.buffer;
    this.$scope.channelStrip.source.node.loop = true;
    this.$scope.channelStrip.source.node.connect(this.$scope.channelStrip.controls[0].node);
    return this.$scope.channelStrip.source.node.start(0, 0);
  };

  MainController.prototype.stop = function() {
    return this.$scope.channelStrip.source.node.stop(0);
  };

  MainController.prototype.reset = function() {
    var control, param, value, _i, _len, _ref, _results;
    _ref = this.$scope.channelStrip.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push((function() {
        var _ref1, _results1;
        _ref1 = control.parameters;
        _results1 = [];
        for (param in _ref1) {
          if (!__hasProp.call(_ref1, param)) continue;
          value = _ref1[param];
          if (param === 'type') {
            _results1.push(control.node.type = value);
          } else {
            _results1.push(control.node[param].value = value);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  return MainController;

})();

TransportController = (function() {
  function TransportController(_at_$scope, _at_transportService) {
    this.$scope = _at_$scope;
    this.transportService = _at_transportService;
    this.stop = __bind(this.stop, this);
    this.play = __bind(this.play, this);
    this.$scope.isPlaying = false;
    this.$scope.play = this.play;
    this.$scope.stop = this.stop;
  }

  TransportController.prototype.play = function() {
    this.transportService.play();
    return this.$scope.isPlaying = true;
  };

  TransportController.prototype.stop = function() {
    this.transportService.stop();
    return this.$scope.isPlaying = false;
  };

  return TransportController;

})();

angular.module('webAudioApp').controller('MainController', ['$scope', '$http', 'channelStripFactory', MainController]).controller('TransportController', ['$scope', 'transportService', TransportController]);

var knob;

knob = function() {
  return {
    link: function(scope, elem, attrs) {
      return elem.bind('click', function() {
        return console.log(scope.thing);
      });
    },
    restrict: 'AE',
    scope: true,
    template: '<h3>Hello World!!</h3>'
  };
};

angular.module('webAudioApp').directive('knob', knob);

angular.module('webAudioApp').factory('channelStripFactory', function() {
  return {
    source: {
      file: 'assets/snare4.wav'
    },
    controls: [
      {
        name: 'Input gain',
        type: 'gain',
        parameters: {
          gain: 1
        }
      }, {
        name: 'HF',
        type: 'biquad',
        parameters: {
          type: 'highshelf',
          frequency: 12000,
          gain: 0
        },
        limits: {
          gain: {
            max: 15,
            min: -15
          }
        }
      }, {
        name: 'HM',
        type: 'biquad',
        parameters: {
          type: 'peaking',
          frequency: 3000,
          gain: 0,
          Q: 1.414
        },
        limits: {
          gain: {
            max: 15,
            min: -15
          },
          frequency: {
            max: 15000,
            min: 500
          }
        }
      }, {
        name: 'LM',
        type: 'biquad',
        parameters: {
          type: 'peaking',
          frequency: 180,
          gain: 0,
          Q: 1.414
        },
        limits: {
          gain: {
            max: 15,
            min: -15
          },
          frequency: {
            max: 1000,
            min: 35
          }
        }
      }, {
        name: 'LF',
        type: 'biquad',
        parameters: {
          type: 'lowshelf',
          frequency: 80,
          gain: 0
        },
        limits: {
          gain: {
            max: 15,
            min: -15
          }
        }
      }, {
        name: 'Fader',
        type: 'gain',
        parameters: {
          gain: 1
        }
      }
    ]
  };
});

var TransportService,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TransportService = (function() {
  function TransportService(_at_$rootScope) {
    this.$rootScope = _at_$rootScope;
    this.stop = __bind(this.stop, this);
    this.play = __bind(this.play, this);
  }

  TransportService.prototype.play = function() {
    return this.$rootScope.$broadcast('play');
  };

  TransportService.prototype.stop = function() {
    return this.$rootScope.$broadcast('stop');
  };

  return TransportService;

})();

angular.module('webAudioApp').service('transportService', ['$rootScope', TransportService]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5jb2ZmZWUiLCJjb25maWcuY29mZmVlIiwiY29udHJvbGxlcnMuY29mZmVlIiwiZGlyZWN0aXZlLmNvZmZlZSIsImZhY3RvcnkuY29mZmVlIiwic2VydmljZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZ0IsYUFBaEIsRUFBOEIsQ0FBRSxXQUFGLENBQTlCLENBQUEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7O0FBQUEsTUFBQSxHQUFTLFNBQUMsY0FBRCxFQUFpQixrQkFBakIsR0FBQTtBQUNQLEVBQUEsTUFBTSxDQUFDLHFCQUFQLEdBQStCLE1BQU0sQ0FBQyxxQkFBUCxJQUFnQyxNQUFNLENBQUMsMkJBQXZDLElBQXNFLE1BQU0sQ0FBQyx3QkFBNUcsQ0FBQTtBQUFBLEVBQ0EsTUFBTSxDQUFDLFlBQVAsR0FBc0IsTUFBTSxDQUFDLFlBQVAsSUFBdUIsTUFBTSxDQUFDLGtCQURwRCxDQUFBO0FBQUEsRUFHQSxrQkFBa0IsQ0FBQyxTQUFuQixDQUE4QixPQUE5QixDQUhBLENBQUE7U0FLQSxjQUFjLENBQUMsS0FBZixDQUFzQixNQUF0QixFQUNFO0FBQUEsSUFBQSxHQUFBLEVBQU0sT0FBTjtBQUFBLElBQ0EsS0FBQSxFQUNHO0FBQUEsTUFBQSxTQUFBLEVBQ0M7QUFBQSxRQUFBLFdBQUEsRUFBYyx3QkFBZDtPQUREO0FBQUEsTUFHQSxXQUFBLEVBQ0M7QUFBQSxRQUFBLFdBQUEsRUFBYywwQkFBZDtBQUFBLFFBQ0EsVUFBQSxFQUFhLHFCQURiO09BSkQ7QUFBQSxNQU9BLFNBQUEsRUFDQztBQUFBLFFBQUEsV0FBQSxFQUFjLHdCQUFkO0FBQUEsUUFDQSxVQUFBLEVBQWEsZ0JBRGI7T0FSRDtLQUZIO0dBREYsRUFOTztBQUFBLENBQVQsQ0FBQTs7QUFBQSxPQXFCTyxDQUFDLE1BQVIsQ0FBZ0IsYUFBaEIsQ0FDRSxDQUFDLE1BREgsQ0FDVSxDQUFFLGdCQUFGLEVBQW9CLG9CQUFwQixFQUF5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Q0FBQyxVQUFaLENBQXdCLE1BQXhCLEVBREk7RUFBQSxDQUxOLENBQUE7OzBCQUFBOztJQURGLENBQUE7O0FBQUEsT0FTTyxDQUFDLE1BQVIsQ0FBZ0IsYUFBaEIsQ0FDRSxDQUFDLE9BREgsQ0FDWSxrQkFEWixFQUMrQixDQUFFLFlBQUYsRUFBZSxnQkFBZixDQUQvQixDQVRBLENBQUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3dlYkF1ZGlvQXBwJywgWyd1aS5yb3V0ZXInXSkiLCJDb25maWcgPSAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3Igd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSBvciB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IG9yIHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHRcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvbWFpbicpXG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgJ21haW4nLFxuICAgIHVybDogJy9tYWluJ1xuICAgIHZpZXdzOlxuICAgICAgJ3NpZGViYXInOlxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9zaWRlYmFyLmh0bWwnXG5cbiAgICAgICd0cmFuc3BvcnQnOlxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90cmFuc3BvcnQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1RyYW5zcG9ydENvbnRyb2xsZXInXG5cbiAgICAgICdtaXhhcmVhJzpcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWl4YXJlYS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnTWFpbkNvbnRyb2xsZXInXG5cblxuYW5ndWxhci5tb2R1bGUoJ3dlYkF1ZGlvQXBwJylcbiAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIENvbmZpZ10pIiwiY2xhc3MgTWFpbkNvbnRyb2xsZXJcbiAgY29uc3RydWN0b3I6IChAJHNjb3BlLCBAJGh0dHAsIGNoYW5uZWxTdHJpcEZhY3RvcnkpIC0+XG4gICAgQCRzY29wZS5jaGFubmVsU3RyaXAgPSBjaGFubmVsU3RyaXBGYWN0b3J5XG4gICAgQCRzY29wZS4kb24oJ3BsYXknLCBAcGxheSlcbiAgICBAJHNjb3BlLiRvbignc3RvcCcsIEBzdG9wKVxuICAgICMgQCRzY29wZS5yZXNldCA9IEByZXNldFxuXG4gICAgQGluaXRBdWRpb0VuZ2luZSgpXG4gICAgQGJ1aWxkQ2hhbm5lbFN0cmlwKClcblxuICBpbml0QXVkaW9FbmdpbmU6IC0+XG4gICAgQGF1ZGlvRW5naW5lID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKVxuXG4gICAgQG1hc3RlckZhZGVyID0gQGF1ZGlvRW5naW5lLmNyZWF0ZUdhaW4oKVxuICAgIEBtYXN0ZXJGYWRlci5jb25uZWN0KEBhdWRpb0VuZ2luZS5kZXN0aW5hdGlvbilcblxuICBidWlsZENoYW5uZWxTdHJpcDogLT5cbiAgICAjIGNyZWF0ZSBhdWRpbyBub2RlcyBmb3IgZWFjaCBjb250cm9sXG4gICAgZm9yIGNvbnRyb2wgaW4gQCRzY29wZS5jaGFubmVsU3RyaXAuY29udHJvbHNcbiAgICAgIHN3aXRjaCBjb250cm9sLnR5cGVcbiAgICAgICAgd2hlbiAnZ2FpbidcbiAgICAgICAgICBjb250cm9sLm5vZGUgPSBAYXVkaW9FbmdpbmUuY3JlYXRlR2FpbigpXG5cbiAgICAgICAgd2hlbiAnYmlxdWFkJ1xuICAgICAgICAgIGNvbnRyb2wubm9kZSA9IEBhdWRpb0VuZ2luZS5jcmVhdGVCaXF1YWRGaWx0ZXIoKVxuXG4gICAgICAjIGZpbGwgaW4gZGVmYXVsdCBwYXJhbWV0ZXJzIGZyb20gdGhlIGZhY3Rvcnkgb2JqZWN0XG4gICAgICBmb3Igb3duIHBhcmFtLCB2YWx1ZSBvZiBjb250cm9sLnBhcmFtZXRlcnNcbiAgICAgICAgaWYgcGFyYW0gaXMgJ3R5cGUnXG4gICAgICAgICAgY29udHJvbC5ub2RlLnR5cGUgPSB2YWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29udHJvbC5ub2RlW3BhcmFtXS52YWx1ZSA9IHZhbHVlXG5cbiAgICAjIGNvbm5lY3QgZWFjaCBub2RlIGluIHNlcmllc1xuICAgIGZvciBjb250cm9sLCBpZHggaW4gQCRzY29wZS5jaGFubmVsU3RyaXAuY29udHJvbHNcbiAgICAgIGlmIGlkeCA8IEAkc2NvcGUuY2hhbm5lbFN0cmlwLmNvbnRyb2xzLmxlbmd0aCAtIDFcbiAgICAgICAgY29udHJvbC5ub2RlLmNvbm5lY3QoQCRzY29wZS5jaGFubmVsU3RyaXAuY29udHJvbHNbaWR4KzFdLm5vZGUpXG4gICAgICBlbHNlXG4gICAgICAgICMgY29ubmVjdCB0aGUgbGFzdCBub2RlIHRvIHRoZSBtaXggYnVzXG4gICAgICAgIGNvbnRyb2wubm9kZS5jb25uZWN0KEBtYXN0ZXJGYWRlcilcblxuICAgIEAkaHR0cC5nZXQoQCRzY29wZS5jaGFubmVsU3RyaXAuc291cmNlLmZpbGUsIHJlc3BvbnNlVHlwZTogJ2FycmF5YnVmZmVyJykudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICBAYXVkaW9FbmdpbmUuZGVjb2RlQXVkaW9EYXRhKHJlc3BvbnNlLmRhdGEsIEBfY3JlYXRlQnVmZmVyTm9kZSlcblxuICBfY3JlYXRlQnVmZmVyTm9kZTogKGJ1ZmZlcikgPT5cbiAgICBAJHNjb3BlLmNoYW5uZWxTdHJpcC5zb3VyY2UuYnVmZmVyID0gYnVmZmVyXG5cbiAgcGxheTogPT5cbiAgICBAJHNjb3BlLmNoYW5uZWxTdHJpcC5zb3VyY2Uubm9kZSA9IEBhdWRpb0VuZ2luZS5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgIEAkc2NvcGUuY2hhbm5lbFN0cmlwLnNvdXJjZS5ub2RlLmJ1ZmZlciA9IEAkc2NvcGUuY2hhbm5lbFN0cmlwLnNvdXJjZS5idWZmZXJcbiAgICBAJHNjb3BlLmNoYW5uZWxTdHJpcC5zb3VyY2Uubm9kZS5sb29wID0gdHJ1ZVxuICAgIEAkc2NvcGUuY2hhbm5lbFN0cmlwLnNvdXJjZS5ub2RlLmNvbm5lY3QoQCRzY29wZS5jaGFubmVsU3RyaXAuY29udHJvbHNbMF0ubm9kZSlcbiAgICBAJHNjb3BlLmNoYW5uZWxTdHJpcC5zb3VyY2Uubm9kZS5zdGFydCgwLCAwKVxuXG4gIHN0b3A6ID0+XG4gICAgQCRzY29wZS5jaGFubmVsU3RyaXAuc291cmNlLm5vZGUuc3RvcCgwKVxuXG4gIHJlc2V0OiA9PlxuICAgIGZvciBjb250cm9sIGluIEAkc2NvcGUuY2hhbm5lbFN0cmlwLmNvbnRyb2xzXG4gICAgICBmb3Igb3duIHBhcmFtLCB2YWx1ZSBvZiBjb250cm9sLnBhcmFtZXRlcnNcbiAgICAgICAgaWYgcGFyYW0gaXMgJ3R5cGUnXG4gICAgICAgICAgY29udHJvbC5ub2RlLnR5cGUgPSB2YWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29udHJvbC5ub2RlW3BhcmFtXS52YWx1ZSA9IHZhbHVlXG5cblxuXG5jbGFzcyBUcmFuc3BvcnRDb250cm9sbGVyXG4gIGNvbnN0cnVjdG9yOiAoQCRzY29wZSwgQHRyYW5zcG9ydFNlcnZpY2UpIC0+XG4gICAgQCRzY29wZS5pc1BsYXlpbmcgPSBmYWxzZVxuICAgIEAkc2NvcGUucGxheSA9IEBwbGF5XG4gICAgQCRzY29wZS5zdG9wID0gQHN0b3BcblxuICBwbGF5OiA9PlxuICAgIEB0cmFuc3BvcnRTZXJ2aWNlLnBsYXkoKVxuICAgIEAkc2NvcGUuaXNQbGF5aW5nID0gdHJ1ZVxuXG4gIHN0b3A6ID0+XG4gICAgQHRyYW5zcG9ydFNlcnZpY2Uuc3RvcCgpXG4gICAgQCRzY29wZS5pc1BsYXlpbmcgPSBmYWxzZVxuXG5cblxuYW5ndWxhci5tb2R1bGUoJ3dlYkF1ZGlvQXBwJylcbiAgLmNvbnRyb2xsZXIgJ01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnY2hhbm5lbFN0cmlwRmFjdG9yeScsIE1haW5Db250cm9sbGVyXVxuICAuY29udHJvbGxlciAnVHJhbnNwb3J0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ3RyYW5zcG9ydFNlcnZpY2UnLCBUcmFuc3BvcnRDb250cm9sbGVyXSIsImtub2IgPSAtPlxuICBsaW5rOiAoc2NvcGUsIGVsZW0sIGF0dHJzKSAtPlxuICAgIGVsZW0uYmluZCAnY2xpY2snLCAtPlxuICAgICAgY29uc29sZS5sb2cgc2NvcGUudGhpbmdcbiAgcmVzdHJpY3Q6ICdBRSdcbiAgc2NvcGU6IHRydWVcbiAgdGVtcGxhdGU6ICc8aDM+SGVsbG8gV29ybGQhITwvaDM+J1xuXG5hbmd1bGFyLm1vZHVsZSgnd2ViQXVkaW9BcHAnKVxuICAuZGlyZWN0aXZlKCdrbm9iJywga25vYikiLCJhbmd1bGFyLm1vZHVsZSgnd2ViQXVkaW9BcHAnKS5mYWN0b3J5ICdjaGFubmVsU3RyaXBGYWN0b3J5JywgLT5cbiAgc291cmNlOlxuICAgIGZpbGU6ICdhc3NldHMvc25hcmU0LndhdidcbiAgY29udHJvbHM6IFtcbiAgICAgIG5hbWU6ICdJbnB1dCBnYWluJ1xuICAgICAgdHlwZTogJ2dhaW4nXG4gICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICBnYWluOiAxXG4gICAgLFxuICAgICAgbmFtZTogJ0hGJ1xuICAgICAgdHlwZTogJ2JpcXVhZCdcbiAgICAgIHBhcmFtZXRlcnM6XG4gICAgICAgIHR5cGU6ICdoaWdoc2hlbGYnXG4gICAgICAgIGZyZXF1ZW5jeTogMTIwMDBcbiAgICAgICAgZ2FpbjogMFxuICAgICAgbGltaXRzOlxuICAgICAgICBnYWluOlxuICAgICAgICAgIG1heDogMTVcbiAgICAgICAgICBtaW46IC0xNVxuICAgICxcbiAgICAgIG5hbWU6ICdITSdcbiAgICAgIHR5cGU6ICdiaXF1YWQnXG4gICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICB0eXBlOiAncGVha2luZydcbiAgICAgICAgZnJlcXVlbmN5OiAzMDAwXG4gICAgICAgIGdhaW46IDBcbiAgICAgICAgUTogMS40MTRcbiAgICAgIGxpbWl0czpcbiAgICAgICAgZ2FpbjpcbiAgICAgICAgICBtYXg6IDE1XG4gICAgICAgICAgbWluOiAtMTVcbiAgICAgICAgZnJlcXVlbmN5OlxuICAgICAgICAgIG1heDogMTUwMDBcbiAgICAgICAgICBtaW46IDUwMFxuICAgICxcbiAgICAgIG5hbWU6ICdMTSdcbiAgICAgIHR5cGU6ICdiaXF1YWQnXG4gICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICB0eXBlOiAncGVha2luZydcbiAgICAgICAgZnJlcXVlbmN5OiAxODBcbiAgICAgICAgZ2FpbjogMFxuICAgICAgICBROiAxLjQxNFxuICAgICAgbGltaXRzOlxuICAgICAgICBnYWluOlxuICAgICAgICAgIG1heDogMTVcbiAgICAgICAgICBtaW46IC0xNVxuICAgICAgICBmcmVxdWVuY3k6XG4gICAgICAgICAgbWF4OiAxMDAwXG4gICAgICAgICAgbWluOiAzNVxuICAgICxcbiAgICAgIG5hbWU6ICdMRidcbiAgICAgIHR5cGU6ICdiaXF1YWQnXG4gICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICB0eXBlOiAnbG93c2hlbGYnXG4gICAgICAgIGZyZXF1ZW5jeTogODBcbiAgICAgICAgZ2FpbjogMFxuICAgICAgbGltaXRzOlxuICAgICAgICBnYWluOlxuICAgICAgICAgIG1heDogMTVcbiAgICAgICAgICBtaW46IC0xNVxuICAgICxcbiAgICAgIG5hbWU6ICdGYWRlcidcbiAgICAgIHR5cGU6ICdnYWluJ1xuICAgICAgcGFyYW1ldGVyczpcbiAgICAgICAgZ2FpbjogMVxuICBdIiwiY2xhc3MgVHJhbnNwb3J0U2VydmljZVxuICBjb25zdHJ1Y3RvcjogKEAkcm9vdFNjb3BlKSAtPlxuXG4gIHBsYXk6ID0+XG4gICAgQCRyb290U2NvcGUuJGJyb2FkY2FzdCgncGxheScpXG5cbiAgc3RvcDogPT5cbiAgICBAJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdG9wJylcblxuYW5ndWxhci5tb2R1bGUoJ3dlYkF1ZGlvQXBwJylcbiAgLnNlcnZpY2UgJ3RyYW5zcG9ydFNlcnZpY2UnLCBbJyRyb290U2NvcGUnLCBUcmFuc3BvcnRTZXJ2aWNlXSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==