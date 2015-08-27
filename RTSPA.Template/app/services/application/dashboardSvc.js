/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict';
    var serviceId = 'dashboardSvc';
    angular.module('app').factory(serviceId, ['$filter', 'common', 'urlServices', 'dashboardRestSvc', 'loggingSvc', dashboardSvc]);

    function dashboardSvc($filter, common, urlServices, dashboardRestSvc, loggingSvc) {
        var service = {
            addData: addData,
            updateData: updateData,
            deleteData: deleteData,
            getData: getData
        }

        return service;

        function addData(element) {
            var defer = common.$q.defer();
            dashboardRestSvc.addData(element).then(function (result) {
                element.id = result.data.response;
                loggingSvc.logging('element created successfully.', loggingSvc.loggingTypes.DEBUG);
                defer.resolve(element);
            }, function (err) {
                loggingSvc.logging(err.data, loggingSvc.loggingTypes.EXCEPTION);
                defer.reject('Error');
            });
            return defer.promise;
        }

        function updateData(element) {
            var defer = common.$q.defer();
            dashboardRestSvc.updateData(element).then(function (result) {
                loggingSvc.logging('element updated successfully.', loggingSvc.loggingTypes.DEBUG);
                defer.resolve(element);
            }, function (err) {
                loggingSvc.logging(err.data, loggingSvc.loggingTypes.EXCEPTION);
                defer.reject('Error');
            });
            return defer.promise;
        }

        function deleteData(id) {
            var defer = common.$q.defer();
            dashboardRestSvc.deleteData(id).then(function (result) {
                loggingSvc.logging('element deleted successfully.', loggingSvc.loggingTypes.DEBUG);
                defer.resolve(result);
            }, function (err) {
                loggingSvc.logging(err.data, loggingSvc.loggingTypes.EXCEPTION);
                defer.reject('Error');
            });
            return defer.promise;
        }

        function getData() {
            var defer = common.$q.defer();
            loggingSvc.logging('elements requested.', loggingSvc.loggingTypes.WARNING);
            dashboardRestSvc.getData().then(function (result) {
                defer.resolve(result.data);
                loggingSvc.logging('elements retrieved successfully.', loggingSvc.loggingTypes.DEBUG);
            }, function (err) {
                loggingSvc.logging('Error loading messages. ' + err.data.ExceptionMessage, loggingSvc.loggingTypes.EXCEPTION);
                defer.reject('Error');
            });
            return defer.promise;
        }
        
    }
})();