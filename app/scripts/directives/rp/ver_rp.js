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

      controller: function($scope) {
        var ctrl = this;

        $scope.$watch('rp', function() {
          ctrl.rp = $scope.rp;
          console.log("hola soy tu rp", ctrl.rp)

        });
      },
      controllerAs: 'd_verRp'
    };
  });
