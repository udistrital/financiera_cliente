'use strict';

/**
* @ngdoc function
* @name financieraClienteApp.controller:ReportesPresupuestoListadoApropiacionesCtrl
* @description
* # ReportesPresupuestoListadoApropiacionesCtrl
* Controller of the financieraClienteApp
*/
angular.module('financieraClienteApp')
.controller('ReporteListadoApropiacionesCtrl', function (financieraRequest, $filter) {
  var ctrl = this;

  ctrl.mostrarGrid = false;

  ctrl.gridOptions = {
    enableFiltering: false,
    enableSorting: false,
    enableRowHeaderSelection: false,
    rowHeight: 30,
    paginationPageSizes: [20, 50, 100],
     paginationPageSize: 20,

    columnDefs: [
      { field: 'Rubro.Codigo' },
      { field: 'Rubro.Nombre' },
      { field: 'Valor', cellFilter: 'currency', cellClass: 'right-letters' }
    ]
  };


  var d = new Date();
  ctrl.fechaActual = d.toLocaleDateString()+" "+d.toLocaleTimeString();

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

  var dd = {
    pageSize: 'A4',
    content: [
      {text: 'Listado de Apropiaciones', style: 'header'},
      {text: 'Fecha del Reporte: \t'+ctrl.fechaActual, alignment: 'center'},
      {text: 'Vigencia: ', style: 'subheader'},
      {text: 'Entidad: ', style: 'subheader'},
      {text: 'Unidad Ejecutora: ', style: 'subheader'},
      {
        style: 'table',
        table: {
          headerRows: 1,
          dontBreakRows: true,
          keepWithHeaderRows: 0,
          body:
          [
            [{text: 'Código', style: 'tableHeader'}, {text: 'Nombre', style: 'tableHeader'}, {text: 'Valor', style: 'tableHeader'}]
          ]
        }
      },
    ],

    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: 'center'
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      table: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    }
  }

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
    ctrl.mostrarGrid = true;
  });
}

ctrl.makePdf = function() {
  dd.content[2].text += ctrl.vigencia;
  dd.content[3].text += ctrl.entidad.Nombre;
  dd.content[4].text += ctrl.unidadEjecutora.Nombre;
  for (var i = 0; i < ctrl.gridOptions.data.length; i++) {
    var apropiacion = ([
      ctrl.gridOptions.data[i].Rubro.Codigo, ctrl.gridOptions.data[i].Rubro.Nombre,
      {text: $filter('currency')(parseInt(ctrl.gridOptions.data[i].Valor)), alignment: 'right'}])
    dd.content[5].table.body.push(apropiacion)
  }
  pdfMake.createPdf(dd).download('Listado_de_apropiaciones.pdf');
}
});
