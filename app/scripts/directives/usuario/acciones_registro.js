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
        var self = this;
        




      },
      controllerAs: 'd_accionesRegistro'
    };
  });
