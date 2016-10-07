'use strict';

var app = angular.module('app', [
    'ui.router',
    '404',
    'hello'
])
    .controller('StartCtrl', ['$scope', function($scope) {
        console.log('its start controller!!');
    }]);
