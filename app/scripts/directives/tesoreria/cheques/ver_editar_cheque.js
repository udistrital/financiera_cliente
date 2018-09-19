'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:tesoreria/cheques/verEditarCheque
 * @description
 * # tesoreria/cheques/verEditarCheque
 */
angular.module('financieraClienteApp')
  .directive('tesoreriaVerEditarCheque', function ($localStorage) {
    return {
      restrict: 'E',
      scope:{
          cheque:'=?'
        },

      templateUrl: 'views/directives/tesoreria/cheques/ver_editar_cheque.html',
      controller:function($scope,$attrs,$window){
        var ctrl = this;
        $scope.ver = 'ver' in $attrs;
        ctrl.opDetalle = function() {
          $window.open('#/orden_pago/proveedor/ver/'+$scope.cheque.OrdenPago.Id, '_blank', 'location=yes');
        }
        ctrl.chequeraDetalle = function() {
          $localStorage.chequera=$scope.cheque.Chequera;
          $window.open('#/tesoreria/cheques/info_chequera', '_blank', 'location=yes');
        }
      },
      controllerAs:'d_tesoreriaVerEditarCheque'
    };
  });
