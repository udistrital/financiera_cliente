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
                row: '=',
                loadRow: '&',
                perfil: '='
            },
            templateUrl: 'directives/btn_registro.html',
            link: function(scope, elm, attrs) {}
        };
    });