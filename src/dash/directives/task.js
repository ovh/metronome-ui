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
        duration: '=',
        icon: '@'
      },
      templateUrl: 'directives/task.html'
    };
  }]).filter('mtTaskStatus', function () {
    return function (input) {
      switch (input) {
        case -1:
          return 'planned';
        case 0:
          return 'Success';
        case 1:
          return 'Failed';
        case 2:
          return 'Expired';
        default:
          return 'Never executed';
      }
    };
  });
})();
