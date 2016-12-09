(function () {
  'use strict';

  angular.module('metronome.services.http', [])
    .factory('http', ['$http', 'CONFIG', function ($http, CONFIG) {
      var token = Cookies.get('token');

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
