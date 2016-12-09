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

      $scope.open = function(task) {
        $location.path('/task/' + task.id);
      };
    }
  ]);
})();
