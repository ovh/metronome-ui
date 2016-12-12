(function () {
  'use strict';

  angular.module('metronome.fragments.task', [])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/task/:id?', {
      templateUrl: 'fragments/task/task.html',
      controller: 'TaskCtrl'
    });
  }])

  .controller('TaskCtrl', ['UserSrv', 'TaskSrv', 'transpiler', '$timeout', '$scope', '$routeParams', '$location', 'toaster',
    function (UserSrv, TaskSrv, transpiler, $timeout, $scope, $routeParams, $location, toaster) {
      $scope.task = {
        name: '',
        urn: '',
        schedule: {
          repeat: '',
          date: '',
          time: '',
          period: '',
          periodIsDate: false,
          epsilon: ''
        },
      };

      if ($routeParams.id) {
        TaskSrv.get($routeParams.id, function (task) {
          if (!task) {
            $location.path('/');
            return;
          }

          var segs = task.schedule.split('/'),
            d = segs[1].split('T');

          $scope.task = {
            id: task.id,
            name: task.name,
            urn: task.URN,
            runCode: task.runCode,
            runAt: task.runAt,
            schedule: {
              repeat: segs[0].substring(1),
              date: d[0],
              time: d[1],
              period: segs[2].substring(1).replace('T', ''),
              periodIsDate: segs[2].indexOf('T') <= 0,
              epsilon: segs[3].substring(1).replace('T', '')
            },
          };
        });
      } else {
        $scope.edit = true;
      }

      // helper
      function extract(str, delim) {
        var v = str.match(new RegExp('(\\d+)' + delim, 'i'));
        return (v ? parseInt(v[1]) : '') || 0;
      }

      var h;
      $scope.nextExec = [];

      function computeNextExec() {
        $scope.nextExec = [];
        if (!$scope.task || !$scope.edit) {
          return;
        }

        function loop(dt) {
          $timeout.cancel(h);
          if (dt > 0)
            h = $timeout(computeNextExec, dt);
        }
        loop(1000);

        var sch = $scope.task.schedule,
          n, i;

        // get repeat
        var r = parseInt(sch.repeat);
        r = isFinite(r) ? r : Number.MAX_SAFE_INTEGER;

        // build start
        if (!sch.date || !sch.time) {
          return loop(0);
        }
        var epsilon = moment.duration({
            seconds: extract(sch.epsilon, 's'),
            minutes: extract(sch.epsilon, 'm'),
          }),
          now = moment.utc().subtract(epsilon),
          start = moment.utc(sch.date + 'T' + sch.time);
        if (!start.isValid()) {
          return loop(0);
        }

        if (sch.periodIsDate) {
          var m = extract(sch.period, 'M'),
            y = extract(sch.period, 'y');

          if (!m && !y) {
            return loop(0);
          }

          n = 0;
          // find next tick
          if (start.unix() < now.unix()) {
            var dy = now.year() - start.year(),
              dm = now.month() - start.month();

            n = dy * 12 + dm + 1;

            if (n > r) {
              return loop(0);
            }
          }

          // Plan next executions
          for (i = n; i < n + 3; i++) {
            $scope.nextExec.push({
              status: -1,
              at: start.clone().add(moment.duration({
                months: m * i,
                years: y * i
              })).unix()
            });

            if (i >= r) {
              return loop(0);
            }
          }
        } else {
          var dt = moment.duration({
            seconds: extract(sch.period, 's'),
            minutes: extract(sch.period, 'm'),
            hours: extract(sch.period, 'h'),
            days: extract(sch.period, 'D'),
          }).asSeconds();

          n = 0;
          if (start.unix() < now.unix()) {
            n = Math.ceil((now.unix() - start.unix()) / dt);

            if (n > r) {
              return loop(0);
            }
          }

          for (i = n; i < n + 3; i++) {
            $scope.nextExec.push({
              status: -1,
              at: moment.unix(start.unix() + dt * i).unix()
            });

            if (i >= r) {
              return loop(0);
            }
          }
        }

        loop(1000);
      }
      computeNextExec();
      $scope.$on('$destroy', function () {
        $timeout.cancel(h);
      });

      $scope.$watchGroup([
        'task.schedule.repeat',
        'task.schedule.date',
        'task.schedule.time',
        'task.schedule.period',
        'task.schedule.epsilon',
        'task.schedule.edit',
      ], function () {
        return computeNextExec();
      });

      $scope.switchEdit = function() {
        $scope.edit = !$scope.edit;
      };

      $scope.switchDelete = function() {
        $scope.delete = !$scope.delete;
      };

      $scope.doDelete = function() {
        TaskSrv.delete($scope.task.id, function (err) {
          if(err) {
            toaster.pop('error', "Error", "Ohoh something went wrong");
            return;
          }
          $location.path('/');
        });
      };

      $scope.abort = function () {
        $scope.edit = !$scope.edit;

        if (!$routeParams.id) {
          $location.path('/');
        }
      };

      $scope.save = function () {
        $scope.$broadcast("validate");
        $timeout(function () {
          var err = false;
          angular.forEach($scope.errs, function (e) {
            err |= !!e;
          });
          if (err) {
            return false;
          }

          var sch = $scope.task.schedule,
            schedule = 'R' + sch.repeat + '/';

          schedule += moment.utc(sch.date + 'T' + sch.time).format();
          schedule += '/P';

          if (sch.periodIsDate) {
            var M = extract(sch.period, 'M'),
              Y = extract(sch.period, 'Y');

            schedule += Y ? (Y + 'Y') : '';
            schedule += M ? (M + 'M') : '';
          } else {
            var D = extract(sch.period, 'D'),
              h = extract(sch.period, 'h'),
              m = extract(sch.period, 'm'),
              s = extract(sch.period, 's');

            schedule += D ? (D + 'D') : '';
            schedule += 'T';
            schedule += h ? (h + 'H') : '';
            schedule += m ? (m + 'M') : '';
            schedule += s ? (s + 'S') : '';
          }
          schedule += '/ET';
          var em = extract(sch.epsilon, 'm'),
            es = extract(sch.epsilon, 's');

          schedule += em ? (em + 'M') : '';
          schedule += es ? (es + 'S') : '';

          TaskSrv.create({
            id: $scope.task.id,
            name: $scope.task.name,
            urn: $scope.task.urn,
            schedule: schedule
          }, function (err, t) {
            if(err) {
              toaster.pop('error', "Error", "Ohoh something went wrong");
              return;
            }

            if (!$routeParams.id) {
              $location.path('/task/' + t.id);
            }

            $scope.edit = !$scope.edit;
          });
        });
      };

      $scope.errs = {};

      var prev = '';
      $scope.switchMode = function () {
        $scope.errs.period = '';

        var tmp = $scope.task.schedule.period;
        $scope.task.schedule.period = prev;
        prev = tmp;
        $scope.task.schedule.periodIsDate = !$scope.task.schedule.periodIsDate;
      };
    }
  ]);
})();
