'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/detalleParaOpMasivo
 * @description
 * # ordenPago/detalleParaOpMasivo
 */
angular.module('financieraClienteApp')
  .directive('detalleParaOpMasivo', function(financieraRequest, administrativaRequest, titanRequest, $timeout, $translate, uiGridConstants, coreRequest) {
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
        // documento
        coreRequest.get('documento',
          $.param({
            query: "TipoDocumento.DominioTipoDocumento.CodigoAbreviacion:DD-FINA,Activo:True",
            limit: -1
          })
        ).then(function(response) {


          self.documento = response.data;
        });
        // unidad ejecutora
        financieraRequest.get('unidad_ejecutora',
          $.param({
            limit:-1
          })
        ).then(function(response) {
          $scope.outputordenpago.UnidadEjecutora = response.data;
          console.log("unidades",$scope.outputordenpago.UnidadEjecutora)
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
          //if($scope.inputtiponomina != undefined){
          if (Object.keys($scope.inputtiponomina).length > 0) {
            // consulta el subtipo op
            var querySubTipo;
            if ($scope.inputtiponomina.tipoNomina == 'HCS' && $scope.inputtiponomina.tipoOrdenPago == "SS") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:OP-SS-HC-SALA";
            } else if ($scope.inputtiponomina.tipoNomina == 'HCH' && $scope.inputtiponomina.tipoOrdenPago == "SS") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:OP-SS-HC-HONO";
            } else if ($scope.inputtiponomina.tipoNomina == 'DP' && $scope.inputtiponomina.tipoOrdenPago == "SS") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:OP-SS-PLAN-DOCE";
            } else if ($scope.inputtiponomina.tipoNomina == 'FP' && $scope.inputtiponomina.tipoOrdenPago == "SS") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-SS,CodigoAbreviacion:OP-SS-PLAN-ADMI";
            } else if ($scope.inputtiponomina.tipoNomina == 'HCH' && $scope.inputtiponomina.tipoOrdenPago == "GENERAL") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-HC,CodigoAbreviacion:OP-HC-HONO";
            } else if ($scope.inputtiponomina.tipoNomina == 'HCS' && $scope.inputtiponomina.tipoOrdenPago == "GENERAL") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-HC,CodigoAbreviacion:OP-HC-SALA";
            } else if ($scope.inputtiponomina.tipoNomina == 'DP' && $scope.inputtiponomina.tipoOrdenPago == "GENERAL") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-PLAN,CodigoAbreviacion:OP-PLAN-DOCE";
            } else if ($scope.inputtiponomina.tipoNomina == 'FP' && $scope.inputtiponomina.tipoOrdenPago == "GENERAL") {
              querySubTipo = "TipoOrdenPago.CodigoAbreviacion:OP-PLAN,CodigoAbreviacion:OP-PLAN-ADMI";
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
          } else {
            self.subTipoOrdenPago = {};
          }
        })
      },
      controllerAs: 'd_detalleParaOpMasivo'
    };
  });
