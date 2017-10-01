'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorDetallePago
 * @description
 * # ordenPago/opProveedorDetallePago
 */
angular.module('financieraClienteApp')
  .directive('opProveedorDetallePago', function(financieraRequest, arkaRequest) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputproveedor: '=',
        outputsubtipoordenpago: '=?',
        outputformapago: '=?',
        outputentradaalmacen: '=?',
        outputvigencia: '=?',
        outputvalorbase: '=?'
      },

      templateUrl: 'views/directives/orden_pago/op_proveedor_detalle_pago.html',
      controller: function($scope) {
        var self = this;
        //sub_tipo_documentos
        financieraRequest.get('sub_tipo_orden_pago',
          $.param({
            query: "TipoOrdenPago.CodigoAbreviacion:OP-PROV",
            limit: 0
          })
        ).then(function(response) {
          self.subTiposOrdenPago = response.data;
        });
        //forma de pago
        financieraRequest.get('forma_pago',
          $.param({
            limit: 0
          })
        ).then(function(response) {
          self.formaPagos = response.data;
        });
        //entradas almacen
        $scope.$watch('inputproveedor', function() {
          if ($scope.inputproveedor != undefined) {
            arkaRequest.get('entrada',
              $.param({
                query: 'Proveedor:' + $scope.inputproveedor,
                limit: -1,
              })
            ).then(function(response) {
              self.entradas = response.data;
            });
          }
          self.ver_seleccion = function($item, $model) {
            $scope.outputentradaalmacen = $item;
          }
        });
        // vigencia
        financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
          .then(function(data) {
            $scope.outputvigencia = parseInt(data.data);
          })
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
      },
      controllerAs: 'd_opProveedorDetallePago'
    };
  });
