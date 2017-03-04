'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rp/rpPorProveedorListar
 * @description
 * # rp/rpPorProveedorListar
 */
angular.module('financieraClienteApp')
  .directive('rpPorProveedorListar', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: '/views/directives/rp/rp_por_proveedor_listar.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_rp/rpPorProveedorListar'
    };
  });
