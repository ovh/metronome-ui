(function () {
  'use strict';

  angular.module('metronome.services.task', [])
    .factory('TaskSrv', ['UserSrv', 'http', function (UserSrv, http) {

      var tasks,
        scope = {
          all: function (cb) {
            http({
              method: 'GET',
              path: '/tasks'
            }).then(function (res, err) {
              if (res.status === 200) {
                tasks = {};
                angular.forEach(res.data, function(t) {
                  tasks[t.id] = t;
                });

                return cb(tasks);
              }
              console.error('Failed to load tasks', res);

              cb(tasks);
            }, function(err) {
              console.error('Failed to load tasks', err);
              cb({});
            });
          },
          get: function (id, cb) {
            if (tasks) {
              return cb(tasks[id]);
            }

            scope.all(function () {
              cb(tasks[id]);
            });
          },
          create: function (task, cb) {
            task.id = task.id || sha256(UserSrv.me().id + task.name + Date.now());

            http({
              method: 'POST',
              path: '/task',
              data: task
            }).then(function (res, err) {
              cb(err, task);
            }, function(err) {
              cb(err);
            });
          },
          delete: function (id, cb) {
            http({
              method: 'DELETE',
              path: '/task/' + id
            }).then(function (res, err) {
              cb(err);
            }, function(err) {
              cb(err);
            });
          }
        };

      return scope;
    }]);
})();
