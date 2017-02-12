'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.goLink
 * @description
 * # goLink
 * Factory in the financieraClienteApp.
 */
angular.module('goLinkFactory', [])
  .factory('goLink', function ($location) {
    // Service logic
    // ...

    // Public API here
    return {
      go: function (path) {
        $location.url(path)
        //return meaningOfLife;
      },
      goWitId: function(path, id){
        $location.url(path + id);
      }
    };
  });
