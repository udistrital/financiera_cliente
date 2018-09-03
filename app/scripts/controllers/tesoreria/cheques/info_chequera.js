'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesInfoChequeraCtrl
 * @description
 * # TesoreriaChequesInfoChequeraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesInfoChequeraCtrl', function ($scope,$localStorage) {
    var ctrl=this;
    ctrl.chequera = $localStorage.chequera;
    console.log("chequera info chequera",  ctrl.chequera);
  });
