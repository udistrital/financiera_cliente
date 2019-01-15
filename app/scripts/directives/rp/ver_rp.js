'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verRp
 * @description
 * # verRp
 */
angular.module('financieraClienteApp')
  .directive('verRp', function() {
    return {
      restrict: 'E',
      scope: {
        rp: '=?',
      },
      templateUrl: 'views/directives/rp/ver_rp.html',

      controller: function($scope,$window) {
        var ctrl = this;

        $scope.$watch('rp', function() {
          ctrl.rp = $scope.rp;
          console.log("hola soy tu rp", ctrl.rp)

        });

        ctrl.verDisponibilidad = function(numero, vigencia){
          console.log('Numero: ', numero);
          console.log('Vigencia: ', vigencia);
          $window.open('#/cdp/cdp_consulta?vigencia='+vigencia+'&numero='+numero, '_blank', 'location=yes');
        };
      },
      controllerAs: 'd_verRp'
    };
  });
