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
  ctrl.isPdf = false;
  var apropiaciones = 0;

  ctrl.gridOptions = {
    enableFiltering: false,
    enableSorting: false,
    enableRowHeaderSelection: false,
    rowHeight: 30,

    columnDefs: [
      { field: 'Rubro.Codigo' },
      { field: 'Rubro.Nombre' },
      { field: 'Valor', cellFilter: 'currency', cellClass: 'right-letters' }
    ]
  };

  ctrl.getTableHeight = function() {
      var rowHeight = 30.1;
      var headerHeight = 30;
      return {
        height: (ctrl.gridOptions.data.length * rowHeight + headerHeight) + "px"
      }
  }

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
      ctrl.gridOptions.data = response.data;
      apropiaciones = response.data.length;
    });

    ctrl.hideReport = !ctrl.hideReport;
  }

  //ctrl.gridOptions.paginationPageSize = apropiaciones;
  //console.log(ctrl.gridOptions.paginationPageSize);
  //ctrl.isPdf = true;

  ctrl.generatePDF = function() {
    kendo.drawing.drawDOM("#reporte", {
      multiPage: true
    }).then(function(group) {
      kendo.drawing.pdf.saveAs(group, "Listado_de_apropiaciones.pdf");
    });
  }

});
