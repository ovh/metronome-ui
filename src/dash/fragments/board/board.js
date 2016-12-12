(function () {
  'use strict';

  angular.module('metronome.fragments.board', [])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/board', {
      templateUrl: 'fragments/board/board.html',
      controller: 'BoardCtrl'
    });
  }])

  .controller('BoardCtrl', ['TaskSrv', '$scope', '$location',
    function (TaskSrv, $scope, $location) {
      TaskSrv.all(function (tasks) {
        $scope.tasks = tasks;
      });

      $scope.open = function (task) {
        $location.path('/task/' + task.id);
      };
    }
  ]).filter('mtTasksCount', function () {
    return function (input, mode) {
      var counters = {
        all: 0,
        success: 0,
        failed: 0,
        unknown: 0
      };
      angular.forEach(input, function (t) {
        counters.all += 1;
        switch (t.runCode) {
          case 0:
            counters.success += 1;
            break;
          case 1:
            counters.failed += 1;
            break;
          default:
            counters.unknown += 1;
        }
      });
      switch (mode) {
        case 'success':
        case 'failed':
        case 'unknown':
          return counters[mode];
        default:
        case 'all':
          return counters.all;
      }
    };
  });
})();
