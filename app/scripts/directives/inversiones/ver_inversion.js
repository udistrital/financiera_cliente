'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verInversion
 * @description
 * # verInversion
 */
angular.module('financieraClienteApp')
  .directive('verInversion', function() {
    return {
      restrict: 'E',
      scope: {
        inversion: '=?',
      },
      templateUrl: 'views/directives/inversiones/ver_inversion.html',

      controller: function($scope) {
        var ctrl = this;

        $scope.$watch('inversion', function() {
          ctrl.inversion = $scope.inversion;

        });
      },
      controllerAs: 'd_verInversion'
    };
  });
