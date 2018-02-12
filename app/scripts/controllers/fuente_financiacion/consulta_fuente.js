'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp').controller('consultaFuenteCtrl', function($window, $scope, $translate, financieraMidRequest, financieraRequest, oikosRequest, coreRequest) {

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
        width: '10%',
      },
      {
        displayName: $translate.instant('TIPO'),
        field: 'TipoFuenteFinanciamiento.Nombre',
        width: '10%',
      },
      {
        displayName: $translate.instant('NOMBRE'),
        field: 'Nombre',
        width: '30%',
      },
      {
        displayName: $translate.instant('DESCRIPCION'),
        field: 'Descripcion',
        width: '50%',
      },
    ]

  };
  self.gridOptions.multiSelect = false;


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
        field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Nombre',
        width: '25%',
        displayName: $translate.instant('RUBRO')
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
        cellTemplate: '<div align="center">{{row.entity.Fecha | date:"yyyy-MM-dd":"UTC"}}</div>'
      },
      {
        field: 'TipoMovimiento.Nombre',
        width: '10%',
        displayName: $translate.instant('MOVIMIENTO')
      },
      {
        field: 'TipoDocumento.TipoDocumento.Nombre',
        width: '15%',
        displayName: $translate.instant('TIPO_DOCUMENTO')
      },
      {
        field: 'TipoDocumento.JsonContenido.Documento.NoDocumento',
        width: '15%',
        displayName: $translate.instant('NO_DOCUMENTO')
      },
      {
        displayName: $translate.instant('FECHA_DOCUMENTO'),
        field: 'TipoDocumento.JsonContenido.Documento.Fecha',
        width: '15%',
        cellTemplate: '<div align="center">{{row.entity.TipoDocumento.JsonContenido.Documento.Fecha | date:"yyyy-MM-dd":"UTC"}}</div>'
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

  self.consulta_fuente_vigencia = function() {
    self.gridOptions.data = [];
    self.fuente_financiamiento = [];
    self.movimiento_fuente_financiamiento_apropiacion = [];

    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=Fecha__startswith:' + parseInt(self.Vigencia)).then(function(response) {
      if (response.data != null) {
        self.movimiento_fuente_financiamiento_apropiacion = response.data;
      }
      console.log(self.movimiento_fuente_financiamiento_apropiacion)
      console.log(response.data)
      console.log(self.Vigencia)
      for (var i = 0; i < self.movimiento_fuente_financiamiento_apropiacion.length; i++) {
        self.repetido = false;

        for (var j = 0; j < self.fuente_financiamiento.length; j++) {
          if (self.movimiento_fuente_financiamiento_apropiacion[i].FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id == self.fuente_financiamiento[j].Id) {
            self.repetido = true;
          }
        }
        if (!self.repetido) {
          self.fuente_financiamiento.push(self.movimiento_fuente_financiamiento_apropiacion[i].FuenteFinanciamientoApropiacion.FuenteFinanciamiento);
        }
      }

      self.gridOptions.data = self.fuente_financiamiento;
      console.log(self.fuente_financiamiento)
    });


  };

  financieraRequest.get("orden_pago/FechaActual/2006")
    .then(function(response) {
      self.vigenciaActual = parseInt(response.data);
      var dif = self.vigenciaActual - 1995;
      var range = [];
      range.push(self.vigenciaActual);
      for (var i = 1; i < dif; i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = range[0];
      self.consulta_fuente_vigencia();
    });

  self.fuente_seleccionada = {};
  self.fuente_financiamiento_apropiacion = [];

  self.gridOptions.onRegisterApi = function(gridApi) {
    self.gridApi = gridApi;
    gridApi.selection.on.rowSelectionChanged($scope, function(row) {
      self.valor_total = 0;
      self.fuente_seleccionada = row.entity;
      self.cambiar_rubro(row.entity);
      $("#myModal").modal();
    });
  };

  self.cambiar_rubro = function(fuente) {
    self.gridOptionsapropiacion.data = [];

    if (fuente.TipoFuenteFinanciamiento.Nombre == "Inversión") {
      self.tipo_fuente = $translate.instant('INVERSION');
    } else {
      self.tipo_fuente = $translate.instant('FUNCIONAMIENTO');
    }
    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id:' + parseInt(fuente.Id) + ',Fecha__startswith:' + parseInt(self.Vigencia)).then(function(response) {

      self.gridOptionsapropiacion.data = response.data;
      angular.forEach(self.gridOptionsapropiacion.data, function(data) {
        oikosRequest.get('dependencia', 'limit=1&query=Id:' + data.FuenteFinanciamientoApropiacion.Dependencia).then(function(response) {
          data.FuenteFinanciamientoApropiacion.Dependencia = response.data[0];
        });
      });

      angular.forEach(self.gridOptionsapropiacion.data, function(data) {
        coreRequest.get('documento', 'limit=1&query=Id:' + data.TipoDocumento).then(function(response) {
          data.TipoDocumento = response.data[0];
          data.TipoDocumento.JsonContenido = JSON.parse(data.TipoDocumento.Contenido);
          var mydate = new Date(data.TipoDocumento.JsonContenido.Documento.FechaDocumento);
          data.TipoDocumento.JsonContenido.Documento.Fecha = mydate;
          console.log(data.TipoDocumento.JsonContenido);

        });
      });
      self.valor_total = 0;
      self.fuente_financiamiento_apropiacion1 = response.data;
      if (self.fuente_financiamiento_apropiacion1) {
        for (var i = 0; i < self.fuente_financiamiento_apropiacion1.length; i++) {
          self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion1[i].Valor;
        }
      }
    });
  };
});
