'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verCuentaContable
 * @description
 * # cuentasContables/verCuentaContable
 */
angular.module('financieraClienteApp')
  .directive('verCuentaContable', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          codigocuenta:'='
        },
      templateUrl: 'views/directives/cuentas_contables/ver_cuenta_contable.html',
      controller:function($scope){
        var self = this;

        self.cargar_cuenta=function(){
          financieraRequest.get('cuenta_contable',$.param({
            query: "Codigo:"+$scope.codigocuenta
          })).then(function(response){
            self.v_cuenta=response.data[0];
          });
        };

        $scope.$watch('codigocuenta',function(){
          self.cmovs=false;
          self.cargar_cuenta();
        });

      },
      controllerAs:'d_verCuentaContable'
    };
  });
