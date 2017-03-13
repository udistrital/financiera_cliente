'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:NotificacionesCtrl
 * @description
 * # NotificacionesCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('NotificacionesCtrl', function($scope, notificacion, datos) {
    $scope.imagePath = 'images/yeoman.png';
    $scope.notificacion = notificacion;
    $scope.datos = datos;
  });
