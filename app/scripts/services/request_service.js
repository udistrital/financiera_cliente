'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.requestRequest
 * @description
 * # requestService
 * Service in the financieraClienteApp.
 */
angular.module('requestService', [])
    .factory('requestRequest', function($q) {
        // Service logic
        // ...
        var canceller = $q.defer();
        var promises = [];
        // Public API here
        return {
            get: function() {
                return promises;
            },
            add: function(promise) {
                promises.push(promise);
                return promise;
            },
            cancel_all: function() {
                angular.forEach(promises, function(p) {
                    console.log(p);
                    if (!angular.isUndefined(p)) {
                        if (p.$$state.status) {
                            console.log("URL: " + p.$$state.value.config.url + ", STATUS: " + p.$$state.value.xhrStatus);
                        } else {
                            canceller.resolve();
                        }
                    }
                });
            }
        };

    });