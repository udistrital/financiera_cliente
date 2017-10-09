'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/proveedor/opProveedorUpdateDetalleOrdenPago
 * @description
 * # ordenPago/proveedor/opProveedorUpdateDetalleOrdenPago
 */
angular.module('financieraClienteApp')
  .directive('opProveedorUpdateDetalleOrdenPago', function(financieraRequest, arkaRequest) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputpreviusdata: '=?',
        inputproveedor: '=',
        outputnewdataselect: '=?'
      },

      templateUrl: 'views/directives/orden_pago/proveedor/op_proveedor_update_detalle_orden_pago.html',
      controller: function($scope) {
        var self = this;

        $scope.$watch('inputpreviusdata', function() {
          if ($scope.inputpreviusdata != undefined) {
            $scope.outputnewdataselect = {};
            $scope.outputnewdataselect.SubTipoOrdenPago = $scope.inputpreviusdata.SubTipoOrdenPago;
            $scope.outputnewdataselect.FormaPago = $scope.inputpreviusdata.FormaPago;
            $scope.outputnewdataselect.ValorBase = $scope.inputpreviusdata.ValorBase;
            self.entrada = {};
            //consultar entrada registrada
            arkaRequest.get('entrada',
              $.param({
                query: "Id:" + $scope.inputpreviusdata.EntradaAlmacen,
              })
            ).then(function(response) {
              self.entradaRegistrada = response.data[0];
              self.entrada.selected = self.entradaRegistrada;
            });
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
          }
          //
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
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
            self.entrada = $item;
          }
        });

        //fin
      },
      controllerAs: 'd_opProveedorUpdateDetalleOrdenPago'
    };
  });
