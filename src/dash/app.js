(function () {
  'use strict';
  if (!Cookies.get('token')) {
    window.location.href = '/';
  }

  angular.module('metronome', [
      'ngRoute',
      'angularMoment',
      'toaster',
      'metronome.services.http',
      'metronome.services.ws',
      'metronome.services.task',
      'metronome.services.transpiler',
      'metronome.services.user',
      'metronome.directives.level',
      'metronome.directives.task',
      'metronome.directives.input',
      'metronome.fragments.board',
      'metronome.fragments.task'
    ])
    .constant('CONFIG', {
      api: 'http://' + location.hostname + ':8081',
      ws: 'ws://' + location.hostname + ':8081',
    })
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.otherwise({
        redirectTo: '/board'
      });
    }])
    .controller('NavCtrl', ['UserSrv', '$scope', function (UserSrv, $scope) {
      $scope.user = UserSrv.me();
    }]);
})();
