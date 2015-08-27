/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'
    var controllerIdentifier = 'indexWebAPICtrl';
    angular.module('app').controller(controllerIdentifier, ['$scope', 'common', 'dashboardSvc', indexWebAPICtrl]);

    function indexWebAPICtrl($scope, common, dashboardSvc) {
        //variables.
        var vm = this;

        //vm variables.
        vm.title = 'Welcome to the Web API page!';
      
        //vm methods.
        vm.getData = getData;

        //watches.

        //run activation.
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerIdentifier).then(function () {
                console.log('load web api controller...');
            });;
        };

        // other methods.
        function getData() {
            dashboardSvc.getData().then(function (result) {
                vm.result = result[0];
            }, function (err) {
                vm.result = '';
                //additional exception handling here.
            });
        };
    };

})();