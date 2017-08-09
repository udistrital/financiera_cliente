'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp').controller('consultaFuenteCtrl', function($window, $scope, $translate, financieraRequest) {

    var self = this;
    self.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 15,

      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          displayName: $translate.instant('CODIGO'),
          field: 'Codigo',
          width: '20%',
        },
        {
          displayName: $translate.instant('NOMBRE'),
          field: 'Nombre',
          width: '30%',
        },
        {
          displayName: $translate.instant('DESCRIPCION'),
          field: 'Descripcion',
          displayName: 'Descripción',
          width: '50%',
        },
      ]

    };
    self.gridOptions.multiSelect = false;

    financieraRequest.get('fuente_financiamiento', 'limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
    });

    self.gridOptionsapropiacion = {
      enableFiltering: true,
      enableSorting: false,
      treeRowHeaderAlwaysVisible: false,
      showTreeExpandNoChildren: false,
      rowEditWaitInterval: -1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 15,

      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Codigo',
          width: '20%',
          displayName: $translate.instant('CODIGO'),
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Descripcion',
          width: '30%',
          displayName: $translate.instant('DESCRIPCION')
        },
        {
          displayName: $translate.instant('FECHA'),
          field: 'Fecha',
          width: '15%',
          cellTemplate: '<div align="center">{{row.entity.Fecha | date:"yyyy-MM-dd":"+0900"}}</div>'
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Dependencia',
          width: '10%',
          displayName: $translate.instant('DEPENDENCIA')
        },
        {
          field: 'TipoMovimiento.Nombre',
          width: '10%',
          displayName: $translate.instant('MOVIMIENTO')
        },
        {
          field: 'Valor',
          cellTemplate: '<div align="right">{{row.entity.Valor | currency}}</div>',
          displayName: $translate.instant('VALOR'),
          width: '10%'
        },
        {
          field: 'TipoDocumento.Nombre',
          width: '15%',
          displayName: $translate.instant('TIPO_DOCUMENTO')
        },
        {
          field: 'NoDocumento',
          width: '15%',
          displayName: $translate.instant('NO_DOCUMENTO')
        },
        {
          displayName: $translate.instant('FECHA_DOCUMENTO'),
          field: 'FechaDocumento',
          width: '15%',
          cellTemplate: '<div align="center">{{row.entity.FechaDocumento | date:"yyyy-MM-dd":"+0900"}}</div>'
        }

      ]
    };
    self.gridOptionsapropiacion.multiSelect = false;

    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
    };

    self.fuente_seleccionada = {};
    self.fuente_financiamiento_apropiacion = [];

    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.valor_total = 0;
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
      });
    };


  });
