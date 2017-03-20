'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opProveedorVerPorId
 * @description
 * # ordenPago/opProveedorVerPorId
 */
angular.module('financieraClienteApp')
  .directive('ordenPago/opProveedorVerPorId', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'add-view.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_ordenPago/opProveedorVerPorId'
    };
  });
