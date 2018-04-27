'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:usuario/accionesRegistro
 * @description
 * # usuario/accionesRegistro
 */
angular.module('financieraClienteApp')
  .directive('accionesRegistro', function() {
    return {
      restrict: 'E',
      scope: {
        opciones: '='
      },
      templateUrl: 'views/directives/usuario/acciones_registro.html',
      controller: function($scope) {
         
      },
      controllerAs: 'd_accionesRegistro'
    };
  });
