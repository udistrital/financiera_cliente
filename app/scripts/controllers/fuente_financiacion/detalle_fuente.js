'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionDetalleFuenteCtrl
 * @description
 * # FuenteFinanciacionDetalleFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.controller('detalleFuenteCtrl', function ($scope,financieraRequest,fuente,oikosRequest) {

    var self = this;

    self.gridOptions = {
      enableFiltering : false,
      enableSorting : false,
      treeRowHeaderAlwaysVisible : false,
      showTreeExpandNoChildren: false,
      rowEditWaitInterval :-1,

         columnDefs : [
           {field: 'Id',               visible : false},
           {field: 'Apropiacion.Rubro.Codigo',     width: '25%',  displayName: 'Código'},
           {field: 'Apropiacion.FechaCreacion',         width: '12%', displayName: 'Fecha Creación',cellTemplate: '<div align="center">{{row.entity.FechaCreacion | date:"yyyy-MM-dd":"+0900"}}</div>'},
           {field: 'Apropiacion.Rubro.Descripcion',width: '39%', resizable : true,           displayName: 'Descripción'},
           {field: 'Dependencia',    width: '9%',  cellTemplate:'<div align="center">{{row.entity.Dependencia }}</div>',  enableCellEdit: false},
           {field: 'Valor',   cellTemplate:'<div align="right">{{row.entity.Valor | currency}}</div>',    width: '15%'},

      ]
    };
    self.gridOptions.multiSelect = false;

    self.fuente_select={};
    financieraRequest.get('fuente_financiacion','query=id:'+fuente.Id).then(function(response) {
        self.fuente_select = response.data;
    });

    financieraRequest.get('fuente_financiacion_apropiacion','query=fuente:'+fuente.Id).then(function(response) {
        self.gridOptions.data = response.data;
    });





});
