'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorVerPorId
 * @description
 * # ordenPago/opProveedorVerPorId
 */
angular.module('financieraClienteApp')
  .directive('opProveedorVerPorId', function (financieraRequest, administrativaRequest) {
    return {
      restrict: 'E',
      scope:{
          opproveedorid:'='
        },

      templateUrl: 'views/directives/orden_pago/op_proveedor_ver_por_id.html',
      controller:function($scope){
        var self = this;
        //
        $scope.$watch('opproveedorid', function(){
          if($scope.opproveedorid != undefined){
            financieraRequest.get('orden_pago',
              $.param({
                  query: "Id:" + $scope.opproveedorid,
              })).then(function(response) {
                self.orden_pago = response.data;
                // proveedor
                self.asignar_proveedor(self.orden_pago[0].RegistroPresupuestal.Beneficiario)
            });
          }
        })
        // buscamos datos del proveedor que esta en el rp
        self.asignar_proveedor = function(beneficiario_id){
          console.log(beneficiario_id);
          administrativaRequest.get('informacion_proveedor',
            $.param({ query: "Id:" + beneficiario_id,})
          ).then(function(response) {
              self.proveedor = response.data;
            });
        }
      //
      },
      controllerAs:'d_opProveedorVerPorId'
    };
  });
