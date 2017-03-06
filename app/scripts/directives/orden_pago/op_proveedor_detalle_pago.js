'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorDetallePago
 * @description
 * # ordenPago/opProveedorDetallePago
 */
angular.module('financieraClienteApp')
  .directive('opProveedorDetallePago', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          tipoordenpago:'='
        },
      
      templateUrl: '/views/directives/orden_pago/op_proveedor_detalle_pago.html',
      controller:function($scope){
        var self = this;

        //tipo_documentos
        financieraRequest.get('tipo_orden_pago',
          'limit=0'
        ).then(function(response) {
          self.tipo_orden_pago_data = response.data;
        });

      },
      controllerAs:'d_opProveedorDetallePago'
    };
  });
