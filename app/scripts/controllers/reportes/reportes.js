'use strict';

/**
* @ngdoc function
* @name financieraClienteApp.controller:ReportesReportesCtrl
* @description
* # ReportesReportesCtrl
* Controller of the financieraClienteApp
*/
angular.module('financieraClienteApp')
.controller('ReportesReportesCtrl', function ($scope, $localStorage, financieraMidRequest) {
  var ctrl = this;

  financieraMidRequest.get('reportes/GetDataSetFinanciera','').then(function(response) {
    ctrl.dataSet = response.data;
  });

  ctrl.setLabelReporte = function(reporteLabel) {
    ctrl.reporteLabel = reporteLabel;
    $localStorage.reporte = ctrl.reporteLabel;
  }
});
