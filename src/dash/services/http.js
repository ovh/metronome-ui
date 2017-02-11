(function () {
  'use strict';

  angular.module('metronome.services.http', ['angular-jwt'])
    .factory('http', ['$http', 'CONFIG', 'jwtHelper', function($http, CONFIG, jwtHelper) {

      var token = Cookies.get('token');
      var now = moment();
      var expirationdate = moment(jwtHelper.getTokenExpirationDate(token)).subtract(1, 'm');

      if (now.isAfter(expirationdate)) {
        $http({
          method: 'POST',
          url: CONFIG.api + "/auth",
          data: JSON.stringify({
            type: "access",
            refreshToken: Cookies.get("refreshToken")
          })
        }).then(function successCallback(response) {
          Cookies.set('token', response.data.token);
        }, function errorCallback(response) {
          console.log("Error on call to renew accessToken:", response)
        });
      }

      token = Cookies.get('token');

      return function(config) {
        return $http(angular.extend({
          headers: {
            'Authorization': token
          },
          url: CONFIG.api + config.path
        }, config));
      };
    }]);
})();
