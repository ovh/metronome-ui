(function () {
  'use strict';

  angular.module('metronome.services.user', [])
    .factory('UserSrv', ['http', function (http) {
      var user = {};

      // load user
      var loading = false;

      function load() {
        if (loading) return;

        loading = true;
        http({
          method: 'GET',
          path: '/user'
        }).then(function (res) {
          loading = false;

          if (res.status === 200) {
            angular.extend(user, res.data);
            console.log('USER', user);
          } else {
            console.error('Failed to load user', res);
          }
        }, function(err) {
          console.error('Failed to load user', err);
        });
      }
      load();

      var scope = {
        me: function () {
          if (!user.id) {
            load();
          }
          return user;
        }
      };

      return scope;
    }]);
})();
