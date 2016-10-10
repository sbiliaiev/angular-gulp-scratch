var hello = angular.module('hello', [])
.controller('HelloController', ['$scope', function($scope) {
    console.log('its hello controller!!');
}]);
