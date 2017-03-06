'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorDetallePago
 * @description
 * # ordenPago/opProveedorDetallePago
 */
angular.module('financieraClienteApp')
  .directive('ordenPago/opProveedorDetallePago', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: '/views/directives/orden_pago/op_proveedor_detalle_pago.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_ordenPago/opProveedorDetallePago'
    };
  });
