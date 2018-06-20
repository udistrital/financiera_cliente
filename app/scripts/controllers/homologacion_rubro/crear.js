'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionRubroCrearCtrl
 * @description
 * # HomologacionRubroCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionRubroCrearCtrl', function ($scope,$translate) {
    var ctrl = this;
    ctrl.creacionRubro=function(){
      $('#modal').modal();
    }
  });
