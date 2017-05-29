'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.factory("fuente",function(){
        return {};
  })
  .controller('consultaFuenteCtrl', function ($window,$scope,financieraRequest) {

    var self = this;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Código',   cellTemplate:'<div align="center">{{row.entity.Codigo}}</div>' ,width: '20%',},
        {field: 'Sigla',    cellTemplate:'<div align="center">{{row.entity.Sigla}}</div>' ,width: '20%',},
        {field: 'Descripcion', displayName : 'Descripción',width: '60%',},
      ]

    };
    self.gridOptions.multiSelect = false;

    financieraRequest.get('fuente_financiacion','limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
    });

    self.gridOptionsapropiacion = {
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
    self.gridOptionsapropiacion.multiSelect = false;

    self.cerrar_ventana= function(){
      $("#myModal").modal('hide');
    };

    self.fuente_seleccionada={};
    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){

        financieraRequest.get('fuente_financiacion_apropiacion','limit=-1&query=fuente:'+row.entity.Id).then(function(response) {
            self.gridOptionsapropiacion.data = response.data;
            self.fuente_seleccionada=row.entity;

        });

        console.log(row.entity.Id);
          $("#myModal").modal();
      });
    };


  });
