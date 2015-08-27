/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict';
    var factoryId = 'serviceManager';
    angular.module('common').factory(factoryId, ['$http', '$state', '$q', '$rootScope', function ($http, $state, $q, $rootScope) {

        return function (methodUri, type, requestBody) {
            var defer = $q.defer();

            var getData = function () {

                $http({ method: type, url: methodUri, data: requestBody })
                .then(function (result) {                    
                    defer.resolve(result);
                }, function (err) {
                    defer.reject(err);
                });
            };

            getData();

            return defer.promise;

        }
    }]);
})();