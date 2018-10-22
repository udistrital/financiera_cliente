'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.arkaService
 * @description
 * # arkaService
 * Factory in the financieraClienteApp.
 */
angular.module('arkaService', [])
    .factory('arkaRequest', function($http,$q, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.ARKA_SERVICE;
        var cancelSearch ; //defer object
        // Public API here
        return {
            get: function(tabla, params) {
              cancelSearch = $q.defer(); //create new defer for new request
              var get
              if (angular.isUndefined(params)||params===null){
                get = path+tabla,{timeout:cancelSearch.promise};
              }else {
                get = path+tabla+"/?"+params,{timeout:cancelSearch.promise};
              }
              return $http.get(get);
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento);
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento);
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id);
            }
        };
    });
