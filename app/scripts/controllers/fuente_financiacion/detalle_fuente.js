'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionDetalleFuenteCtrl
 * @description
 * # FuenteFinanciacionDetalleFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('detalleFuenteCtrl', function($scope, financieraRequest, $translate, fuente, oikosRequest) {

    var self = this;

    self.gridOptions = {
      enableFiltering: false,
      enableSorting: false,
      treeRowHeaderAlwaysVisible: false,
      showTreeExpandNoChildren: false,
      rowEditWaitInterval: -1,

      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'Apropiacion.Rubro.Codigo',
          width: '25%',
          displayName: $translate.instant('CODIGO')
        },
        {
          field: 'Apropiacion.FechaCreacion',
          width: '12%',
          displayName: $translate.instant('FECHA_CREACION'),
          cellTemplate: '<div align="center">{{row.entity.FechaCreacion | date:"yyyy-MM-dd":"+0900"}}</div>'
        },
        {
          field: 'Apropiacion.Rubro.Descripcion',
          width: '39%',
          resizable: true,
          displayName: $translate.instant('DESCRIPCION')
        },
        {
          field: 'Dependencia',
          width: '9%',
          cellTemplate: '<div align="center">{{row.entity.Dependencia }}</div>',
          enableCellEdit: false,
          displayName: $translate.instant('DEPENDENCIA')
        },
        {
          field: 'Valor',
          cellTemplate: '<div align="right">{{row.entity.Valor | currency}}</div>',
          width: '15%',
          displayName: $translate.instant('VALOR')
        },

      ]
    };
    self.gridOptions.multiSelect = false;

    self.fuente_select = {};
    financieraRequest.get('fuente_financiamiento', 'query=id:' + fuente.Id).then(function(response) {
      self.fuente_select = response.data;
    });

    financieraRequest.get('fuente_financiamiento_apropiacion', 'query=fuente:' + fuente.Id).then(function(response) {
      self.gridOptions.data = response.data;
    });





  });
