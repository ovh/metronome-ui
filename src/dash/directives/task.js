(function () {
  'use strict';

  angular.module('metronome.directives.task', [])

  .directive('mtTask', [function () {
    return {
      restrict: 'E',
      scope: {
        name: '=',
        status: '=',
        time: '=',
        icon: '@'
      },
      templateUrl: 'directives/task.html'
    };
  }]);
})();
