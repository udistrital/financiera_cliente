'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp').controller('consultaFuenteCtrl', function($window, $scope, $translate, financieraRequest, oikosRequest) {

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
          width: '18%',
          displayName: $translate.instant('CODIGO'),
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Descripcion',
          width: '25%',
          displayName: $translate.instant('DESCRIPCION')
        },
        {
          field: 'FuenteFinanciamientoApropiacion.Dependencia.Nombre',
          width: '25%',
          displayName: $translate.instant('DEPENDENCIA')
        },
        {
          displayName: $translate.instant('FECHA'),
          field: 'Fecha',
          width: '10%',
          cellTemplate: '<div align="center">{{row.entity.Fecha | date:"yyyy-MM-dd":"+0900"}}</div>'
        },
        {
          field: 'TipoMovimiento.Nombre',
          width: '10%',
          displayName: $translate.instant('MOVIMIENTO')
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
        },
        {
          field: 'Valor',
          cellTemplate: '<div align="right">{{row.entity.Valor | currency}}</div>',
          displayName: $translate.instant('VALOR'),
          width: '15%'
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
        angular.forEach(self.gridOptionsapropiacion.data, function (data) {
          oikosRequest.get('dependencia', 'limit=1&query=Id:' + data.FuenteFinanciamientoApropiacion.Dependencia).then(function (response) {
            data.FuenteFinanciamientoApropiacion.Dependencia = response.data[0];
          });
        });

        angular.forEach(self.gridOptionsapropiacion.data, function (data) {
          coreRequest.get('tipo_documento', 'limit=1&query=Id:' + data.Tipo_Documento).then(function (response) {
            data.Tipo_Documento = response.data[0];
          });
        });

        self.fuente_financiamiento_apropiacion = response.data;
        for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
          self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion[i].Valor;
        }
      });
    };


  });
