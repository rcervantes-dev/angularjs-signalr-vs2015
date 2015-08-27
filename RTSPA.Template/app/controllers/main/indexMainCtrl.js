/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'
    var controllerIdentifier = 'indexMainCtrl';
    angular.module('app').controller(controllerIdentifier, ['$scope', 'common', indexMainCtrl]);

    function indexMainCtrl($scope, common) {
        var vm = this;

        vm.title = 'Welcome to the main page!';
      
        //watches.

        //run activation.
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerIdentifier).then(function () {
                console.log('load main controller...');
            });;
        };

    };

})();