'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:devoluciones/pagosAcademica
 * @description
 * # devoluciones/pagosAcademica
 */
angular.module('financieraClienteApp')
  .directive('devolPagosAcademica', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/devoluciones/pagos_academica.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_devol_pagosAcademica'
    };
  });
