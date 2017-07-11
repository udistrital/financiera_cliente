'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verSolicitud
 * @description
 * # verSolicitud
 */
angular.module('financieraClienteApp')
  .directive('verSolicitud', function() {
    return {
      restrict: 'E',
      scope: {
        sol: '=?'
      },
      templateUrl: 'views/directives/avance/ver_solicitud.html',

      controller: function($scope,financieraRequest) {
        var ctrl = this;

        $scope.$watch('sol', function() {
          ctrl.solicitud = $scope.sol;          
        });
      },
      controllerAs: 'd_verSolicitud'
    };
  });
