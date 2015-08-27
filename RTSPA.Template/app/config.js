/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'
    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-left';

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess'
    };

    //REST Services 
    var urlServices = { servicesUri: 'http://localhost:45555/' }; //'http://real-time-spa.cloudapp.net/'
    app.constant('urlServices', urlServices);

    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (data) {
        data.configuration.controllerActivateSuccessEvent = events.controllerActivateSuccess;
    }]);

})();