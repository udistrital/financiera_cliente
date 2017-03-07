'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:concepto/conceptoPorRubroListar
 * @description
 * # concepto/conceptoPorRubroListar
 */
angular.module('financieraClienteApp')
  .directive('concepto/conceptoPorRubroListar', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: '/views/directives/concepto/concepto_por_rubro_listar.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_concepto/conceptoPorRubroListar'
    };
  });
