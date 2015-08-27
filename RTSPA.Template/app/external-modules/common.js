/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'

    var commonModule = angular.module('common', []);

    commonModule.provider('commonConfig', function () {
        this.configuration = {};
        this.$get = function () {
            return { configuration: this.configuration };
        };

    });

    commonModule.factory('common', ['$rootScope', '$q', 'logger', 'serviceManager', 'commonConfig', common]);

    function common($rootScope, $q, logger, serviceManager, commonConfig) {

        var service = {
            $q: $q,
            activateController: activateController,
            logger: logger,
            serviceManager: serviceManager
        };

        return service;

        function activateController(promises, controllerIdentifier) {
            return $q.all(promises).then(function (eventArgs) {
                var data = { controllerIdentifier: controllerIdentifier };
                $broadcast(commonConfig.configuration.controllerActivateSuccessEvent, data);
            });
        };

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        };

    };


})();