'use strict';

angular.module('financieraClienteApp')
    .factory('modelsRequest', function($http, CONF) {
        var path = CONF.GENERAL.MODELS_SERVICE;
        // Public API here
        return {
            get: function(tabla) {
                return $http.get(path + tabla + ".json");
            }
        };
    });