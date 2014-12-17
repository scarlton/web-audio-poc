angular.module('WebAudio', []).config(function() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  return window.AudioContext = window.AudioContext || window.webkitAudioContext;
});

var MainController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty;

MainController = (function() {
  function MainController($scope, $http, channelStripFactory) {
    this.$scope = $scope;
    this.$http = $http;
    this.stop = __bind(this.stop, this);
    this.play = __bind(this.play, this);
    this._createBufferNode = __bind(this._createBufferNode, this);
    this.$scope.channelStrip = channelStripFactory;
    this.$scope.play = this.play;
    this.$scope.stop = this.stop;
    this.initAudioEngine();
    this.buildChannelStrip();
  }

  MainController.prototype.initAudioEngine = function() {
    this.$scope.audioEngine = new window.AudioContext();
    this.$scope.masterFader = this.$scope.audioEngine.createGain();
    this.$scope.masterFader.connect(this.$scope.audioEngine.destination);
    return this.$scope.isPlaying = false;
  };

  MainController.prototype.buildChannelStrip = function() {
    var control, idx, param, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    _ref = this.$scope.channelStrip.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      switch (control.type) {
        case 'gain':
          control.node = this.$scope.audioEngine.createGain();
          break;
        case 'biquad':
          control.node = this.$scope.audioEngine.createBiquadFilter();
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
        control.node.connect(this.$scope.masterFader);
      }
    }
    return this.$http.get('assets/snare4.wav', {
      responseType: 'arraybuffer'
    }).then((function(_this) {
      return function(response) {
        return _this.$scope.audioEngine.decodeAudioData(response.data, _this._createBufferNode);
      };
    })(this));
  };

  MainController.prototype._createBufferNode = function(buffer) {
    return this.$scope.channelStrip.source.buffer = buffer;
  };

  MainController.prototype.play = function() {
    this.$scope.channelStrip.source.node = this.$scope.audioEngine.createBufferSource();
    this.$scope.channelStrip.source.node.buffer = this.$scope.channelStrip.source.buffer;
    this.$scope.channelStrip.source.node.loop = true;
    this.$scope.channelStrip.source.node.connect(this.$scope.channelStrip.controls[0].node);
    this.$scope.channelStrip.source.node.start(0, 0);
    return this.$scope.isPlaying = true;
  };

  MainController.prototype.stop = function() {
    this.$scope.channelStrip.source.node.stop(0);
    return this.$scope.isPlaying = false;
  };

  return MainController;

})();

angular.module('WebAudio', []).controller('MainController', ['$scope', '$http', 'channelStripFactory', MainController]);

angular.module('WebAudio').factory('channelStripFactory', function() {
  return {
    source: {},
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
