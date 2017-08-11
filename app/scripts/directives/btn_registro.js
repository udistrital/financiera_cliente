'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:btnRegistro
 * @description
 * # btnRegistro
 */
angular.module('financieraClienteApp')
    .directive('btnRegistro', function() {
        return {
            restrict: 'E',
            scope: {
                fila: '=',
                funcion: '&',
                perfil: '='
            },
            templateUrl: 'views/directives/btn_registro.html',
            link: function(scope, elm, attrs) {}
        };
    });