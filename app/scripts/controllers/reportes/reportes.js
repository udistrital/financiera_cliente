'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ReportesReportesCtrl
 * @description
 * # ReportesReportesCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ReportesReportesCtrl', function ($scope, $localStorage) {
    var ctrl = this;
    ctrl.reportes = [
      {nombre: 'Control Nomina', label: 'RteControlNomina'},
      {nombre: 'Descuentos FEUD', label: 'RteDescFEUD'}
    ];

    $scope.prueba = function(reporteLabel) {
      ctrl.reporteLabel = reporteLabel;
      $localStorage.reporte = ctrl.reporteLabel;
    }
  });
