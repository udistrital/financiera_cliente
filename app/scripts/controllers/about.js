'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AboutCtrl', function(financieraRequest, $timeout, $http, $scope, configuracionRequest, $rootScope, agoraRequest) {
    $scope.OrdenPago = {};
    $scope.SenData = {};
    $scope.SenData.Usuario = {'Id': 1}

    //Ordenes
    financieraRequest.get('orden_pago',
      $.param({
        query: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion:OP-PROV',
        limit:'-1',
      })
    ).then(function(response){
      $scope.SenData.OrdenPago = response.data;

      //newvo estado
      financieraRequest.get('estado_orden_pago',
        $.param({
          query: 'CodigoAbreviacion:EOP_02',
          limit:'-1',
        })
      ).then(function(response){
        $scope.SenData.NuevoEstado = response.data[0];


        //console.log($scope.SenData);
        financieraRequest.post("orden_pago_estado_orden_pago/WorkFlowOrdenPago", $scope.SenData)
        .then(function(data){
          console.log("Respuesta");
          $scope.resultado = data;
          console.log($scope.resultado);
          console.log("Respuesta");
        })

      })
    })
  });
