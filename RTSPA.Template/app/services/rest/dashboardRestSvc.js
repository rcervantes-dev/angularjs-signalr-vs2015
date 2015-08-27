/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict';
    var serviceId = 'dashboardRestSvc';
    angular.module('app').factory(serviceId, ['common', 'urlServices', 'serviceManager', dashboardRestSvc]);

    function dashboardRestSvc(common, urlServices, serviceManager) {

        var service = {            
            addData: addData,
            updateData: updateData,
            deleteData: deleteData,
            getData: getData
        }

        return service;

        function addData(element) {
            return serviceManager(urlServices.servicesUri + 'api/service/AddData', 'post', { element: element });
        }

        function updateData(element) {
            return serviceManager(urlServices.servicesUri + 'api/service/UpdateData', 'post', { element: element });
        }

        function deleteData(id) {
            return serviceManager(urlServices.servicesUri + 'api/service/DeleteData', 'post', { id: id });
        }

        function getData() {
            return serviceManager(urlServices.servicesUri + 'api/service/getData', 'get', null);
        }
        
    }
})();