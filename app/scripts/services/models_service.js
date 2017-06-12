'use strict';

angular.module('financieraClienteApp')
.factory('modelsRequest', function($http) {
  var path = "scripts/models/";
  // Public API here
  return {
    get: function(tabla) {
      return $http.get(path + tabla + ".json");
    }
  };
});
