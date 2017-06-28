'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .factory("fuente", function() {
    return {};
  })

  .controller('consultaFuenteCtrl', function($window, fuente, $scope, $translate, financieraRequest) {

    var self = this;
    self.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          displayName: $translate.instant('CODIGO'),
          field: 'Codigo',
          width: '30%',
        },
        {
          displayName: $translate.instant('SIGLA'),
          field: 'Sigla',
          width: '30%',
        },
        {
          displayName: $translate.instant('DESCRIPCION'),
          field: 'Descripcion',
          displayName: 'Descripción',
          width: '40%',
        },
      ]

    };
    self.gridOptions.multiSelect = false;

    financieraRequest.get('fuente_financiamiento', 'limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
    });

    self.gridOptionsapropiacion = {
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
          field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Codigo',
          width: '35%',
          displayName: $translate.instant('CODIGO'),
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Descripcion',
          width: '35%',
          resizable: true,
          displayName: $translate.instant('DESCRIPCION'),
        },
        {
          field: 'Fecha',
          width: '10%',
          cellTemplate: '<div align="center">{{row.entity.Fecha | date:"yyyy-MM-dd":"+0900"}}</div>'
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Dependencia',
          width: '10%',
          displayName: $translate.instant('DEPENDENCIA'),
          enableCellEdit: false
        },
        {
          field: 'Valor',
          cellTemplate: '<div align="right">{{row.entity.Valor | currency}}</div>',
          displayName: $translate.instant('VALOR'),
          width: '10%'

        },

      ]
    };
    self.gridOptionsapropiacion.multiSelect = false;

    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
    };

    self.fuente_seleccionada = {};
    self.fuente_financiamiento_apropiacion = [];
    self.valor_total = 0;
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {

        self.mostrar_registro(row.entity.Id);
        self.fuente_seleccionada = row.entity;


        console.log(row.entity.Id);
        $("#myModal").modal();
      });
    };

    self.mostrar_registro =function(fuente) {

      financieraRequest.get('movimiento_fuente_financiamiento_apropiacion', 'limit=-1&query=FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id:' + fuente ).then(function(response) {

        self.gridOptionsapropiacion.data = response.data;
        self.fuente_financiamiento_apropiacion = response.data;
        for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
          self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion[i].Valor;
        }
        console.log("-")

      });
    };


  });
