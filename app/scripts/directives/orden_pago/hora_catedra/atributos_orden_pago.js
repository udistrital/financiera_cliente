'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/horaCatedra/atributosOrdenPago
 * @description
 * # ordenPago/horaCatedra/atributosOrdenPago
 */
angular.module('financieraClienteApp')
  .directive('horaCatedraAtributosOrdenPago', function (financieraRequest, financieraMidRequest, administrativaRequest, titanRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope:{
        inputpestanaabierta: '=?',
        inputnomina: '=?',
        ouputordenpago: '=?',
        ouputmesaje: '=?'
        },

      templateUrl: 'views/directives/orden_pago/hora_catedra/atributos_orden_pago.html',
      controller:function($scope){
        var self = this;
        $scope.ouputordenpago = {};

        // unidad ejecutora
        financieraRequest.get('unidad_ejecutora',
          $.param({
            query: 'Id:1', //llega por rol de usuario
          })
        ).then(function(response) {
          $scope.ouputordenpago.UnidadEjecutora = response.data[0];
        });
        //forma de pago
        financieraRequest.get('forma_pago',
          $.param({
            limit: 0
          })
        ).then(function(response) {
          self.formaPagos = response.data;
        });
        //homolocar tipo nomina con tipo orden_pago
        $scope.$watch('inputnomina', function() {
          if ($scope.inputnomina != undefined) {
            self.codigo ="";
            if ($scope.inputnomina.TipoNomina.Nombre == 'FP'){
                self.codigo = "OP-PLAN-ADMI";
            }else if ($scope.inputnomina.TipoNomina.Nombre == 'DP') {
                self.codigo = "OP-PLAN-DOCE";
            }else if ($scope.inputnomina.TipoNomina.Nombre == 'HCH') {
                self.codigo = "OP-HC-HONO";
            }else if ($scope.inputnomina.TipoNomina.Nombre == 'HCS') {
              self.codigo = "OP-HC-SALA";
            }
            financieraRequest.get('sub_tipo_orden_pago',
              $.param({
                query: 'CodigoAbreviacion:' + self.codigo,
              })
            ).then(function(response){
              $scope.ouputordenpago.SubTipoOrdenPago = response.data[0];
            });
          }
        });
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        });

      //fin
      },
      controllerAs:'d_horaCatedraAtributosOrdenPago'
    };
  });
