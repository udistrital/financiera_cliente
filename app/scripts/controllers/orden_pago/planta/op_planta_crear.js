'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaCrearCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaCrearCtrl', function ($scope, financieraRequest, $window, $translate) {
    var self = this;
    $scope.a = true;
    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006")  //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.fecha = data;
        console.log(self.fecha.data)
      })


  });
