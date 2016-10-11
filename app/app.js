var app = angular.module('app', [
    'ui.router',
    'hello'
])

.controller('StartCtrl', ['$scope', function($scope) {
    console.log('its start controller!!');
}])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/404");

    $stateProvider
        .state('404', {
            url: '/404',
            templateUrl: './components/404/404.html'
        })
	    .state('hello', {
	    	url: '/hello',
            controller: 'HelloController',
            templateUrl: './components/hello/hello.html'
        });
}]);
