'use strict';

/**
* @ngdoc function
* @name financieraClienteApp.controller:ReportesPresupuestoListadoApropiacionesCtrl
* @description
* # ReportesPresupuestoListadoApropiacionesCtrl
* Controller of the financieraClienteApp
*/
angular.module('financieraClienteApp')
.controller('ReporteListadoApropiacionesCtrl', function (financieraRequest) {
  var ctrl = this;

  financieraRequest.get('apropiacion/VigenciaApropiaciones', $.param({
    limit: 0
  })).then(function(response) {
    ctrl.vigencias = response.data;
  });


  financieraRequest.get('unidad_ejecutora', $.param({
    limit: 0
  })).then(function(response) {
    ctrl.unidadesEjecutoras = response.data;
  });

  ctrl.buscarApropiaciones = function() {
    financieraRequest.get('apropiacion', $.param({
      limit: -1,
      fields: 'Rubro,Valor',
      query: 'Vigencia:'+ctrl.vigencia+',Rubro.UnidadEjecutora:'+ctrl.unidadEjecutora.Id,
      exclude: 'Rubro.Codigo.istartswith:2-0,Rubro.Codigo.startswith:3-0',
      sortby: 'Rubro',
      order: 'asc'
    })).then(function(response) {
      ctrl.apropiaciones = response.data;
    });
  }

  ctrl.generatePDF = function() {
    console.log("generando pdf....");
    kendo.drawing.drawDOM($("#testForm")).then(function(group) {
      console.log("si..?");
      kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf");
    });
  }

});
