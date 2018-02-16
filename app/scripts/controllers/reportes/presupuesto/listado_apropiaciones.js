'use strict';

/**
* @ngdoc function
* @name financieraClienteApp.controller:ReportesPresupuestoListadoApropiacionesCtrl
* @description
* # ReportesPresupuestoListadoApropiacionesCtrl
* Controller of the financieraClienteApp
*/
angular.module('financieraClienteApp')
.controller('ReporteListadoApropiacionesCtrl', function (financieraRequest, $scope) {
  var ctrl = this;
  ctrl.hideReport = false;

  ctrl.gridOptions = {
    enableFiltering: false,
    enableSorting: false,
    enableRowHeaderSelection: false,
    paginationPageSize: 20,

    columnDefs: [
      { field: 'Rubro.Codigo' },
      { field: 'Rubro.Nombre' },
      { field: 'Valor' }
    ]
  };

  var d = new Date();
  ctrl.fechaActual = d.toLocaleDateString()+" "+d.toLocaleTimeString();

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
    financieraRequest.get('entidad').then(function(response) {
      ctrl.entidad = response.data[0];
    });

    financieraRequest.get('apropiacion', $.param({
      limit: -1,
      fields: 'Rubro,Valor',
      query: 'Vigencia:'+ctrl.vigencia+',Rubro.UnidadEjecutora:'+ctrl.unidadEjecutora.Id,
      exclude: 'Rubro.Codigo.istartswith:2-0,Rubro.Codigo.startswith:3-0',
      sortby: 'Rubro',
      order: 'asc'
    })).then(function(response) {
      //ctrl.apropiaciones = response.data;
      ctrl.gridOptions.data = response.data;
      //ctrl.gridOptions.paginationPageSize = response.data.length;
      console.log(ctrl.gridOptions.paginationPageSize );
    });

    ctrl.hideReport = !ctrl.hideReport;
  }

  ctrl.generatePDF = function() {
    kendo.drawing.drawDOM($("#testForm")).then(function(group) {
      kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf");
    });
  }

});
