'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:bancos/verBanco
 * @description
 * # bancos/verBanco
 */
angular.module('financieraClienteApp')
  .directive('verBanco', function(coreRequest) {
    return {
      restrict: 'E',
      scope: {
        idbanco: '='
      },
      templateUrl: 'views/directives/bancos/ver_banco.html',
      controller: function($scope) {
        var self = this;

        self.cargar_banco = function() {
          coreRequest.get('banco', $.param({
            query: "Id:" + $scope.idbanco,
            limit: -1
          })).then(function(response) {
            self.banco = response.data[0];
            coreRequest.get('sucursal', $.param({
              query: "Banco:" + self.banco.Id,
              fields: "Id,Nombre",
              limit: -1
            })).then(function(response) {
              self.banco.sucursales = response.data;
              angular.forEach(self.banco.sucursales, function(item) {
                coreRequest.get('contacto_sucursal', $.param({
                  query: 'Sucursal:' + item.Id,
                  fields: 'Contacto,TipoContacto',
                  limit: -1
                })).then(function(response) {
                  item.Contactos = response.data;
                });
              });
            });
          });
        };

        $scope.$watch('idbanco', function() {
          if ($scope.idbanco !== undefined) {
            self.cargar_banco();
          }
        }, true);

      },
      controllerAs: 'd_verBanco'
    };
  });
