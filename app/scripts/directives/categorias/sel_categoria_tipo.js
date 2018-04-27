'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:categorias/selCategoriaTipo
 * @description
 * # categorias/selCategoriaTipo
 */
angular.module('financieraClienteApp')
  .directive('selCategoriaTipo', function(financieraRequest) {
      return {
          restrict: 'E',
          scope: {
              categoria: '=?',
              tipo: '=?',
              reload: '=?'
          },
          templateUrl: 'views/directives/categorias/sel_categoria_tipo.html',
          controller: function($scope, $attrs) {
            var self=this;
            self.sel_tipo='tipo' in $attrs;
            self.cargar_categorias = function() {
              financieraRequest.get("categoria_compromiso", $.param({
                sortby: "Id",
                order: "asc",
                limit: -1
              })).then(function(response) {
                self.categorias = response.data;
              });
            };
            $scope.$watch('reload',function(){
              self.cargar_categorias();
            },true);
          },
          controllerAs: 'd_selCategoriaTipo'
      };
  });
