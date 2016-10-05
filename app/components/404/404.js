var _404 = angular.module('404', [])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/404");

        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'components/404/404.html'
            });
    }]);
