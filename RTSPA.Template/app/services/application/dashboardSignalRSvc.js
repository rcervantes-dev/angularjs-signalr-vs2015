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