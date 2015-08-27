/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'
    var controllerIdentifier = 'indexDashboardCtrl';
    angular.module('app').controller(controllerIdentifier, ['$scope', '$interval', 'common', 'dashboardSignalRSvc', indexDashboardCtrl]);

    function indexDashboardCtrl($scope, $interval, common, dashboardSignalRSvc) {

        //variables.
        var vm = this;
        var stop;
        var maxIntervalRefresh = 1000;
        var maxLimitTablePressure = 10;
        var dps_values = [];
        var xVal_Graph = 0;
        var maxPointsInGraph = 10;

        //vm variables.
        vm.title = 'Welcome to the dashboard page!';
        vm.description = 'Streaming real time data from SignalR hub to AngularJS factory.';
        vm.dataCollection = [];
        vm.result = '';

        //vm methods.
        
        $scope.$on('$destroy', function () {
            stop_realtime();
        });
        
        //graphic.
        var graphicTemperature = new CanvasJS.Chart("graphContainer", {
            backgroundColor: 'transparent',
            title: {
                text: "Temperature (real-time)"
            },
            axisX: {
                title: "Time"
            },
            axisY: {
                title: "deg F"
            },
            data: [{
                type: "line",
                markerColor: "blue",
                dataPoints: dps_values
            }]
        });

        //watches.
        $scope.$watch(function () { return dashboardSignalRSvc.notificationInLive; }, function (newValue, oldValue) {
            if (newValue.Timestamp) {
                vm.dataCollection.unshift({ Name: newValue.Name, Value: newValue.Value, Timestamp: newValue.Timestamp });
                updateChart(newValue.Value);
            }
        }, true);

        $scope.$watch(function () { return vm.dataCollection; }, function (newValue, oldValue) {
            if (vm.dataCollection.length > maxLimitTablePressure) {
                vm.dataCollection.pop();
            }
        }, true);

        //run activation.
        activate();

        //interval promise.
        function start_realtime() {
            if (angular.isDefined(stop)) return;
            stop = $interval(function () { }, maxIntervalRefresh);
        };

        function stop_realtime() {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };
        
        //other methods.
        function activate() {
            var promises = [];
            common.activateController(promises, controllerIdentifier).then(function () {
                console.log('load dashboard controller...');
                start_realtime();                
                for (var i = 0; i <= 9; i++)
                    vm.dataCollection.push({ Name: 'receiving data...', Value: 'receiving data...', Timestamp: 'receiving data...' });
            });;
        };      

        function updateChart(value) {
            dps_values.push({ x: parseFloat(xVal_Graph), y: parseFloat(value) });
            xVal_Graph++;

            if (dps_values.length > maxPointsInGraph) {
                dps_values.shift();
            }

            graphicTemperature.render();
        }

    };

})();