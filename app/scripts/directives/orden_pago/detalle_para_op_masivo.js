'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/detalleParaOpMasivo
 * @description
 * # ordenPago/detalleParaOpMasivo
 */
angular.module('financieraClienteApp')
  .directive('detalleParaOpMasivo', function(financieraRequest, administrativaRequest, titanRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputtiponomina: '=',
        inputunidadejecutor: '=?',
        inputusuarioregistra: '=?',
        outputordenpago: '=?'
      },

      templateUrl: 'views/directives/orden_pago/detalle_para_op_masivo.html',
      controller: function($scope) {
        var self = this;
        $scope.outputordenpago = {};
        $scope.outputordenpago.Vigencia = 0;
        // obtener vigencia
        // financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
        //   .then(function(data) { //error con el success
        //     $scope.outputordenpago.Vigencia = parseInt(data.data);
        //   });

        // unidad ejecutora
        financieraRequest.get('unidad_ejecutora',
          $.param({
            query: 'Id:1', //llega por rol de usuario
          })
        ).then(function(response) {
          $scope.outputordenpago.UnidadEjecutora = response.data[0];
        });
        //forma de pago
        financieraRequest.get('forma_pago',
          $.param({
            limit: 0
          })
        ).then(function(response) {
          self.formaPagos = response.data;
        });

        $scope.$watch('inputtiponomina', function() {
          if ($scope.inputtiponomina != undefined) {
            // consulta el subtipo op
            if ($scope.inputtiponomina.tipoNomina == 'HCS' && $scope.inputtiponomina.tipoOrdenPago == "SS") {
              var querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:OP-SS-SALA";
            } else if ($scope.inputtiponomina.tipoNomina == 'HCH' && $scope.inputtiponomina.tipoOrdenPago == "SS") {
              var querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:OP-SS-HONO";
            } else if ($scope.inputtiponomina.tipoNomina == 'HCH' && $scope.inputtiponomina.tipoOrdenPago == "HC") {
              var querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-PROV";
            } else if ($scope.inputtiponomina.tipoNomina == 'HCS' && $scope.inputtiponomina.tipoOrdenPago == "HC") {
              var querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-PROV";
            }
            // get sub_tipo_orden_pago
            if (querySubTipo != undefined) {
              financieraRequest.get('sub_tipo_orden_pago',
                $.param({
                  query: querySubTipo,
                  limit: -1,
                })
              ).then(function(response) {
                self.subTipoOrdenPago = response.data;
              });
            }

          }
        })
      },
      controllerAs: 'd_detalleParaOpMasivo'
    };
  });
