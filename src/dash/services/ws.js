(function () {
  'use strict';

  angular.module('metronome.services.ws', [])
    .factory('ws', ['CONFIG', 'toaster', '$timeout',
      function (CONFIG, toaster, $timeout) {
        var handlers = {};

        function connect() {
          var conn = new WebSocket(CONFIG.ws + '/ws');
          conn.onopen = function () {
            conn.send(Cookies.get('token'));
          };
          conn.onclose = function (evt) {
            console.warn('WS CLOSED');
            setTimeout(connect, 500);
          };
          conn.onmessage = function (evt) {
            var sep = evt.data.indexOf(':');
            if (sep < 0) {
              console.error('WS no scope', evt.data);
              return;
            }
            var scope = evt.data.substr(0, sep),
              msg = JSON.parse(evt.data.slice(sep + 1));

            if (handlers[scope]) {
              $timeout(function () {
                handlers[scope](msg);
              });
            }
          };
        }

        if (window["WebSocket"]) {
          connect();
        } else {
          toaster.pop('error', "Error", "WebSocket not available. Realtime update disable.");
        }
        return {
          on: function (scope, cb) {
            handlers[scope] = cb;
          }
        };
      }
    ]);
})();
