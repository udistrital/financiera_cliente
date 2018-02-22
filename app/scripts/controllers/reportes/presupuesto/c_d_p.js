'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ReportesPresupuestoCDPCtrl
 * @description
 * # ReportesPresupuestoCDPCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ReportesPresupuestoCDPCtrl', function (financieraRequest, oikosRequest, $scope) {
    var ctrl = this;

    // Vigencias de apropiaciones
    financieraRequest.get('apropiacion/VigenciaApropiaciones', $.param({
      limit: 0
    })).then(function(response) {
      ctrl.vigencias = response.data;
    });

    // Unidades ejecutoras
    financieraRequest.get('unidad_ejecutora', $.param({
      limit: 0
    })).then(function(response) {
      ctrl.unidadesEjecutoras = response.data;
    });

    financieraRequest.get('tipo_fuente_financiamiento', $.param({
      fields: "Id,Nombre"
    })).then(function(response) {
      ctrl.tiposFuentesFinanciamiento = response.data;
    });

    oikosRequest.get('dependencia', $.param({
      limit: 0,
      fields: "Id,Nombre",
      sortby: "Nombre",
      order: "asc"
    })).then(function(response) {
      ctrl.dependencias = response.data;
    })
  });
