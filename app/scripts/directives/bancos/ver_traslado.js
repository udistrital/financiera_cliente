'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verTraslados
 * @description
 * # verTraslados
 */
angular.module('financieraClienteApp')
  .directive('verTraslados', function() {
    return {
      restrict: 'E',
      scope: {
        sol: '=?',
        tipos: '=?'
      },
      templateUrl: 'views/directives/bancos/ver_traslados.html',

      controller: function($scope) {
        var ctrl = this;

        $scope.$watch('sol', function() {
          ctrl.id = $scope.id;
        });
      },
      controllerAs: 'd_verTraslados'
    };
  });
