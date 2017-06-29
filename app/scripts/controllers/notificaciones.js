'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:NotificacionesCtrl
 * @alias notificaciones
 * @requires $scope
 * @requires financieraNotificacion.service:notificacion
 * @param {service} notificacion Servicio para el API de financiera {@link financieraNotificacion.service:notificacion}
 * @description
 * # NotificacionesCtrl
 * Controller de vista de notificaciones
 */

angular.module('financieraClienteApp')

  .controller('NotificacionesCtrl', function($scope, notificacion) {
    $scope.imagePath = 'images/yeoman.png';
    $scope.notificacion = notificacion;
  });
