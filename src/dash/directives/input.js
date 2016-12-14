(function () {
  'use strict';

  angular.module('metronome.directives.input', [])

  .directive('mtInput', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        value: '=',
        max: '=',
        placeholder: '@',
        type: '@',
        format: '@',
        min: '@',
        err: '=?'
      },
      link: function (scope, elem, attr) {
        var h, v;

        function validate(silent, preserve) {
          // reset
          $timeout.cancel(h);
          scope.msg = '';
          scope.err = '';

          v = (scope.model + '').trim();

          if (angular.isDefined(attr.required) && !v) {
            scope.err = silent ? '' : 'Required';
            scope.value = '';
            return false;
          }

          switch (scope.type) {
            case 'number':
              if (v === '') {
                break;
              }

              v = parseInt(v);
              if (!isFinite(v)) {
                scope.err = 'Bad format';
                return false;
              }
              if (v < parseInt(scope.min)) {
                scope.err = 'Bad format';
                return false;
              }
              break;
            case 'date':
              if (!v) {
                break;
              }

              var m = moment(v, scope.format);
              v = m.format(scope.format);

              if (!m.isValid()) {
                scope.err = 'Bad format';
                return false;
              }
              break;

            case 'urn':
              if (!v) {
                break;
              }

              if (!/^(\S+):\/\/(\S+)$/.test(v)) {
                scope.err = 'Bad format. Should be "proto://path"';
                return false;
              }

              break;
            case 'period':
              if (!v) {
                break;
              }

              // extract def
              var parts = scope.format.split(','),
                delems = [],
                def = {};

              parts.forEach(function (p) {
                var seg = p.match(/([a-z]):(\d+)-(\d+)/i);
                delems.push(seg[1]);
                def[seg[1]] = {
                  min: parseInt(seg[2]),
                  max: parseInt(seg[3]),
                };
              });

              // check format
              var seg = v.match(new RegExp('(\\d+[' + delems.join('') + '])', 'ig'));
              if (!seg) {
                scope.err = 'Bad format';
                return false;
              }

              // extract and check values
              var res = {};
              seg.forEach(function (s) {
                delems.forEach(function (d) {
                  var vs = s.match(new RegExp('(\\d+)' + d, 'i'));
                  if (vs) {
                    res[d] = parseInt(vs[1]);
                    if (res[d] < def[d].min || res[d] > def[d].max) {
                      scope.err = 'Bad format';
                    }
                  }
                });
              });
              if (scope.err) {
                return false;
              }

              // format
              var d = '';
              delems.forEach(function (s) {
                d += res[s] ? (res[s] + s) : '';
              });

              v = d;
              break;
          }

          if (v != scope.model && !silent && !preserve) {
            scope.msg = 'Reformated';
            h = $timeout(function () {
              scope.msg = '';
            }, 700);
          }

          if (!preserve)
            scope.model = v;
          scope.value = v;
          return true;
        }

        scope.change = function () {
          validate(false, true);
        };

        scope.blur = function () {
          validate();
        };

        scope.focus = function () {
          $timeout.cancel(h);
          scope.msg = '';
          scope.err = '';
        };

        scope.$on("validate", function () {
          validate();
        });

        scope.model = scope.value;
        validate(true);
        scope.$watch('value', function (now, old) {
          if (scope.value == v)
            return;
          scope.model = scope.value;
          validate(true);
        });
      },
      templateUrl: 'directives/input.html'
    };
  }]);
})();
