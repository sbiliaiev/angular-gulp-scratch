var hello = angular.module('hello', [])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/404");

        $stateProvider
            .state('hello', {
                url: '/hello',
                controller: 'HelloController',
                templateUrl: 'components/hello/hello.html'
            });
    }])

    .controller('HelloController', ['$scope', function($scope) {
        console.log('its hello controller!!');
    }]);
