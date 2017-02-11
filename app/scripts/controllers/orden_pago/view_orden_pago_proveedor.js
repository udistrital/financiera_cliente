'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoViewOrdenPagoProveedorCtrl
 * @description
 * # OrdenPagoViewOrdenPagoProveedorCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ViewOrdenPagoProveedorCtrl', function ($scope, $routeParams) {

    $scope.parametro = $routeParams.Id;

  });
