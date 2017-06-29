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
    //path de imagenes de notificacion, esto será temporal
    $scope.imagePath = 'images/yeoman.png';
    //Paso de parametro a la vista por scope para uso desde vista de notificacion
    $scope.notificacion = notificacion;
  });
