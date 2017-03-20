'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorVerPorId
 * @description
 * # ordenPago/opProveedorVerPorId
 */
angular.module('financieraClienteApp')
  .directive('opProveedorVerPorId', function (financieraRequest, $timeout) {
    return {
      restrict: 'E',
      scope:{
          opproveedorid:'='
        },

      templateUrl: 'views/directives/orden_pago/op_proveedor_ver_por_id.html',
      controller:function($scope){
        var self = this;
        //
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };

        $scope.$watch('opproveedorid', function(){
          self.refresh();
          if($scope.opproveedorid != undefined){
            financieraRequest.get('orden_pago',
              $.param({
                  query: "Id:" + $scope.opproveedorid,
              })).then(function(response) {
                self.orden_pago = response.data;
            });
          }
        })
      //
      },
      controllerAs:'d_opProveedorVerPorId'
    };
  });
