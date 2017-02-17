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
    'ui.grid.autoResize',
    'ngStorage',
    'financieraService'
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
      .when('/conceptos/concepto/:Id', {
        templateUrl: 'views/conceptos/concepto.html',
        controller: 'ConceptoCtrl',
        controllerAs: 'concepto'
      })
      .when('/compromisos/nuevo', {
        templateUrl: 'views/compromisos/crear_compromiso.html',
        controller: 'CrearCompromisoCtrl',
        controllerAs: 'crearCompromiso'
      })
      .when('/plan_cuentas/cuentas/nueva', {
        templateUrl: 'views/plan_cuentas/crear_cuentas.html',
        controller: 'PlanCuentasCrearCuentasCtrl',
        controllerAs: 'crearCuentas'
      })
      .when('/plan_cuentas/nuevo', {
        templateUrl: 'views/plan_cuentas/crear_plan.html',
        controller: 'PlanCuentasCrearPlanCtrl',
        controllerAs: 'crearPlan'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
