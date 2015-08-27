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