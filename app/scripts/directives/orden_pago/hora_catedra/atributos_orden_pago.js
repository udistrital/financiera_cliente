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
        ouputordenpago: '=?'
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
