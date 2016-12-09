(function () {
  'use strict';

  angular.module('metronome.directives.level', [])

  .directive('mtLevel', [function () {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        max: '=',
      },
      link: {
        pre: function (scope) {
          scope.ratio = scope.value / scope.max * 100;
        }
      },
      templateUrl: 'directives/level.html'
    };
  }]);
})();
