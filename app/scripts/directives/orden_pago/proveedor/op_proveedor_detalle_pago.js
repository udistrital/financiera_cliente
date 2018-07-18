'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorDetallePago
 * @description
 * # ordenPago/opProveedorDetallePago
 */
angular.module('financieraClienteApp')
  .directive('opProveedorDetallePago', function(financieraRequest, arkaRequest, coreRequest) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputproveedor: '=',
        outputsubtipoordenpago: '=?',
        outputformapago: '=?',
        outputentradaalmacen: '=?',
        outputvigencia: '=?',
        outputvalorbase: '=?',
        outputdocumento: '=?',
      },

      templateUrl: 'views/directives/orden_pago/proveedor/op_proveedor_detalle_pago.html',
      controller: function($scope) {
        var self = this;
        //documentos financieros
        coreRequest.get('documento',
          $.param({
            query: "TipoDocumento.DominioTipoDocumento.CodigoAbreviacion:DD-FINA,Activo:True",
            limit: -1
          })
        ).then(function(response) {
          self.documento = response.data;
        });
        //sub_tipo_orden_pago
        financieraRequest.get('sub_tipo_orden_pago',
          $.param({
            query: "TipoOrdenPago.CodigoAbreviacion:OP-PROV",
            limit: 0
          })
        ).then(function(response) {
          self.subTiposOrdenPago = response.data;
          $scope.outputsubtipoordenpago = self.subTiposOrdenPago[0];
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
            $scope.outputentradaalmacen = $item.Id;
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
            $scope.a = $scope.inputpestanaabierta
          }
        })
      },
      controllerAs: 'd_opProveedorDetallePago'
    };
  });
