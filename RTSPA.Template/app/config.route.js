/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'
    var app = angular.module('app');

    app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', routeConfigurator]);

    function routeConfigurator($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: "loadPartial/Main/Index",
                controller: 'indexMainCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "loadPartial/Dashboard/Index",
                controller: 'indexDashboardCtrl',
                controllerAs: 'vm',
                resolve: {
                    init: ['dashboardSignalRSvc',
                            function (dashboardSignalRSvc) {
                                console.log('loading dashboard service...');
                                return dashboardSignalRSvc.initialize();
                            }]
                }
            })
            .state('webapi', {
                url: "/webapi",
                 templateUrl: "loadPartial/WebAPI/Index",
                 controller: 'indexWebAPICtrl',
                 controllerAs: 'vm',
                 resolve: {
                 }
             })
    };

})();