///#source 1 1 /app/app.js
/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict'
    var app = angular.module('app', ['common', 'ui.router']);

    app.run(['$rootScope', '$location', function ($rootScope, $location) {

    }]);

})();
///#source 1 1 /app/config.route.js
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
            .state('refreshapp', {
                url: "/refreshapp",
                templateUrl: "loadPartial/Home/RefreshApp",
                controller: 'refreshAppCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
    };

})();
///#source 1 1 /app/config.js
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
///#source 1 1 /app/external-modules/common.js
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
///#source 1 1 /app/external-modules/logger.js
/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict';

    angular.module('common').factory('logger', ['$log', logger]);

    function logger($log) {
        var service = {
            getLogFn: getLogFn,
            log: log,
            logError: logError,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        function getLogFn(moduleId, fnName) {
            fnName = fnName || 'log';
            switch (fnName.toLowerCase()) { // convert aliases
                case 'success':
                    fnName = 'logSuccess'; break;
                case 'error':
                    fnName = 'logError'; break;
                case 'warn':
                    fnName = 'logWarning'; break;
                case 'warning':
                    fnName = 'logWarning'; break;
            }

            var logFn = service[fnName] || service.log;
            return function (msg, data, showToast) {
                logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);
            };
        }

        function log(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'info');
        }

        function logWarning(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'warning');
        }

        function logSuccess(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'success');
        }

        function logError(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'error');
        }

        function logIt(message, data, source, showToast, toastType) {
            var write = (toastType === 'error') ? $log.error : $log.log;
            source = source ? '[' + source + '] ' : '';
            write(source, message, data);
            if (showToast) {
                if (toastType === 'error') {
                    toastr.error(message);
                } else if (toastType === 'warning') {
                    toastr.warning(message);
                } else if (toastType === 'success') {
                    toastr.success(message);
                } else {
                    toastr.info(message);
                }
            }
        }
    }
})();
///#source 1 1 /app/external-modules/serviceManager.js
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
///#source 1 1 /app/controllers/main/indexMainCtrl.js
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
///#source 1 1 /app/controllers/dashboard/indexDashboardCtrl.js
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
///#source 1 1 /app/controllers/webapi/indexWebAPICtrl.js
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
///#source 1 1 /app/services/rest/dashboardRestSvc.js
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
///#source 1 1 /app/services/application/loggingSvc.js
/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict';
    var serviceId = 'loggingSvc';
    angular.module('app').factory(serviceId, ['common', loggingSvc]);

    //*****************SETTINGS*****************
    var logInConsole = false;

    function loggingSvc(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId),
            logError = getLogFn(serviceId, 'Error'),
            logWarning = getLogFn(serviceId, 'warning'),
            logSuccess = common.logger.getLogFn(serviceId, 'success');

        //configuration of notifications.
        var notificationConfiguration = {
            showSuccess: true,
            showInformation: true,
            showWarning: true,
            showDebug: true,
            showException: true
        };

        //logging types.
        var loggingTypes = { INFORMATION: 'INFORMATION', WARNING: 'WARNING', EXCEPTION: 'EXCEPTION', SUCCESS: 'SUCCESS', DEBUG: 'DEBUG' };

        var service = {
            loggingTypes: loggingTypes,
            logging: logging,
        };

        return service

        function logging(message, loggingType) {
            try {

                if (logInConsole)
                    console.log("[" + new Date().format("dd/mm/yyyy HH:MM:ss L tt") + "] - " + message);

                switch (loggingType) {
                    case loggingTypes.SUCCESS:
                        {
                            if (notificationConfiguration.showSuccess)
                                logSuccess(message, null, true);
                            break;
                        }
                    case loggingTypes.INFORMATION:
                        {
                            if (notificationConfiguration.showInformation)
                                log(message);
                            break;
                        }
                    case loggingTypes.WARNING:
                        {
                            if (notificationConfiguration.showWarning)
                                logWarning(message);
                            break;
                        }
                    case loggingTypes.DEBUG:
                        {
                            if (notificationConfiguration.showDebug)
                                log(message);
                            break;
                        }
                    case loggingTypes.EXCEPTION:
                        {
                            if (notificationConfiguration.showException) {
                                logError(message, null, true);
                            }

                            break;
                        }
                }

            } catch (e) {
                console.log('there was an error logging data. ' + e);
            }
        }
        
    }

})();
///#source 1 1 /app/services/application/dashboardSignalRSvc.js
/// <reference path="~/scripts/vendor/angularjs/angular.js" />
(function () {
    'use strict';
    var serviceId = 'dashboardSignalRSvc';
    angular.module('app').factory(serviceId, ['$rootScope', 'common', 'loggingSvc', dashboardSignalRSvc]);

    function dashboardSignalRSvc($rootScope, common, loggingSvc) {

        //variables.
        var proxy = null;
        var ticker = jQuery.connection.dashboardhub;
        var notificationInLive = { Name: '', Value: '', Timestamp: ''};
        var service = {
            initialize: initialize,
            //notifications.            
            enableNotifications: enableNotifications,
            disableNotifications: disableNotifications,
            notificationInLive: notificationInLive
        };

        return service;

        function initialize() {

            var defer = common.$q.defer();

            proxy = jQuery.connection.hub.createHubProxy('dashboardhub');
            proxy.on('updateNotification', function (notification) {
                updateNotification(notification);
            });

            jQuery.connection.hub.start().then().then(function () {
            }).done(function (state) {
                enableNotifications();
                defer.resolve(true);
            });

            console.log('dashboard service loaded...');
            return defer.promise;
        }
     
        //notifications.
        function enableNotifications() {
            ticker.server.enableNotifications();
        }

        function disableNotifications() {
            ticker.server.disableNotifications();
        }

        function updateNotification(notification) {
            angular.copy({ Name: notification.Name, Value: notification.Value , Timestamp: notification.Timestamp }, notificationInLive);
        }
    }
})();
///#source 1 1 /app/services/application/dashboardSvc.js
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
