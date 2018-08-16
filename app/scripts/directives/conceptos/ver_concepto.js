'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/verConcepto
 * @description
 * # conceptos/verConcepto
 */
angular.module('financieraClienteApp')
  .directive('verConcepto', function(financieraRequest) {
    return {
      restrict: 'E',
      scope: {
        codigoconcepto: '='
      },
      templateUrl: 'views/directives/conceptos/ver_concepto.html',
      controller: function($scope) {
        var self = this;

        self.cargar_concepto = function() {
          financieraRequest.get('concepto', $.param({
            query: "Codigo:" + $scope.codigoconcepto
          })).then(function(response) {
            self.v_concepto = response.data[0];
            financieraRequest.get('afectacion_concepto', $.param({
              query: "Concepto:" + self.v_concepto.Id
            })).then(function(response) {
              if(typeof(response.data) !== "string"){
                 self.afectaciones = response.data;
                 
              }
              
            });
            financieraRequest.get('concepto_cuenta_contable', $.param({
              query: "Concepto:" + self.v_concepto.Id
            })).then(function(response) {
              
              if(typeof(response.data) !== "string"){
                 self.cuentas = response.data;
                 console.log("ño")
              }


            });
          });
        };

        $scope.$watch('codigoconcepto',function(){
          self.cargar_concepto();
        });
      },
      controllerAs: 'd_verConcepto'
    };
  });
