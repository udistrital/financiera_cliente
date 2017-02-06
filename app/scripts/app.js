'use strict';

/**
 * @ngdoc overview
 * @name financieraClienteApp
 * @description
 * # financieraClienteApp
 *
 * Main module of the application.
 */
angular
  .module('financieraClienteApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ngStorage',
    'financieraService',
    'administrativaService'
  ])
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/conceptos/nuevo', {
        templateUrl: 'views/conceptos/crear_concepto.html',
        controller: 'CrearConceptoCtrl',
        controllerAs: 'crearConcepto'
      })
      .when('/orden_pago_all', {
        templateUrl: 'views/orden_pago/orden_pago.html',
        controller: 'OrdenPagoCtrl',
        controllerAs: 'ordenPago'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
