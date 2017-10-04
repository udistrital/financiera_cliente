'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AboutCtrl', function($scope, configuracionRequest, $rootScope, agoraRequest) {

    var self = this;

    agoraRequest.get('informacion_proveedor',
      $.param({
        query: "Estado.ValorParametro:ACTIVO",
        limit: -1
      })).then(function(response) {
      self.terceros = response.data;
      console.log("AAAAAAAA");
      console.log(self.terceros);
      console.log("AAAAAAAA");
    });

    self.ver_seleccion = function($item, $model) {
        ctrl.tercero = $item;
    }

  });
