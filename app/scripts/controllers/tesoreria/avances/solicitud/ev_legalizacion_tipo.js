'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl
 * @description
 * # TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('EvLegalizacionTipoCtrl', function ($scope,$localStorage,$routeParams) {
    var ctrl = this;
    ctrl.legalizacion = $localStorage.legalizacion;
    ctrl.tipolegalizacion = $routeParams.tipoAvanceLegalizacion;
    ctrl.ver = $routeParams.ver;
    console.log("VER ",ctrl.ver);
  });
