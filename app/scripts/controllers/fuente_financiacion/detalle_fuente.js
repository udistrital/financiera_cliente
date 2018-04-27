'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionDetalleFuenteCtrl
 * @description
 * # FuenteFinanciacionDetalleFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp').controller('detalleFuenteCtrl', function($window, $timeout, $scope, $translate, financieraMidRequest, financieraRequest, oikosRequest, coreRequest) {

  var self = this;
  var i;
  var j;

  self.unidad_ejecutora = 1;

  self.consulta_fuente_vigencia = function() {

    self.fuente_financiamiento = [];
    self.movimiento_fuente_financiamiento_apropiacion = [];
    self.fuente_seleccionada = {};

    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=FuenteFinanciamientoApropiacion.Apropiacion.Vigencia:' + parseInt(self.Vigencia)).then(function(response) {
  // financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1').then(function(response) {
      if (response.data != null) {
        self.movimiento_fuente_financiamiento_apropiacion = response.data;
      }
      for (i = 0; i < self.movimiento_fuente_financiamiento_apropiacion.length; i++) {
        self.repetido = false;

        for (j = 0; j < self.fuente_financiamiento.length; j++) {
          if (self.movimiento_fuente_financiamiento_apropiacion[i].FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id == self.fuente_financiamiento[j].Id) {
            self.repetido = true;
          }
        }
        if (!self.repetido) {
          self.fuente_financiamiento.push(self.movimiento_fuente_financiamiento_apropiacion[i].FuenteFinanciamientoApropiacion.FuenteFinanciamiento);
        }
      }
      self.actualizar();
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
    });

  self.gridOptionCDP = {
    enableFiltering: true,
    enableSorting: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    paginationPageSizes: [5, 10, 15],
    paginationPageSize: 5,

    columnDefs: [{
        field: 'Id',
        visible: false
      },
      {
        field: 'NumeroDisponibilidad',
        width: '5%',
        cellClass: 'input_center',
        displayName: $translate.instant('NO'),
      },
      {
        field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Numero',
        width: '10%',
        cellClass: 'input_center',
        displayName: $translate.instant('NECESIDAD_NO'),
      },
      {
        field: 'FechaRegistro',
        width: '12%',
        displayName: $translate.instant('FECHA_REGISTRO'),
        cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</div>'
      },
      {
        field: 'DisponibilidadApropiacion[0].Apropiacion.Rubro.Codigo',
        width: '17%',
        displayName: $translate.instant('CODIGO')
      },
      {
        field: 'DisponibilidadApropiacion[0].Apropiacion.Rubro.Nombre',
        width: '22%',
        displayName: $translate.instant('RUBRO')
      },
      {
        field: 'Solicitud.DependenciaSolicitante.Nombre',
        width: '22%',
        displayName: $translate.instant('DEPENDENCIA_SOLICITANTE')
      },
      {
        field: 'DisponibilidadApropiacion[0].Valor',
        width: '12%',
        displayName: $translate.instant('VALOR'),
        cellTemplate: '<div align="right">{{row.entity.DisponibilidadApropiacion[0].Valor | currency}}</div>'
      }

    ]
  };
  self.gridOptionCDP.multiSelect = false;

  self.gridOptionCRP = {
    enableFiltering: true,
    enableSorting: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    paginationPageSizes: [5, 10, 15],
    paginationPageSize: 5,

    columnDefs: [{
        field: 'Id',
        visible: false
      },
      {
        field: 'NumeroRegistroPresupuestal',
        width: '5%',
        cellClass: 'input_center',
        displayName: $translate.instant('NO'),
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
        width: '6%',
        cellClass: 'input_center',
        displayName: $translate.instant('NO_CDP'),
      },
      {
        field: 'InfoSolicitudDisponibilidad.SolicitudDisponibilidad.Necesidad.Numero',
        width: '10%',
        cellClass: 'input_center',
        displayName: $translate.instant('NECESIDAD_NO'),
      },
      {
        field: 'FechaRegistro',
        width: '11%',
        displayName: $translate.instant('FECHA_REGISTRO'),
        cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</div>'
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
        width: '15%',
        displayName: $translate.instant('CODIGO'),
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Nombre',
        width: '20%',
        displayName: $translate.instant('RUBRO')
      },
      {
        field: 'InfoSolicitudDisponibilidad.DependenciaSolicitante.Nombre',
        width: '20%',
        displayName: $translate.instant('DEPENDENCIA_SOLICITANTE')
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].Valor',
        width: '12%',
        displayName: $translate.instant('VALOR'),
        cellTemplate: '<div align="right">{{row.entity.RegistroPresupuestalDisponibilidadApropiacion[0].Valor | currency}}</div>'
      }

    ]
  };
  self.gridOptionCRP.multiSelect = false;

  self.gridOptionOP = {
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
        field: 'Consecutivo',
        width: '6%',
        cellClass: 'input_center',
        displayName: $translate.instant('NO'),
      },
      {
        field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
        width: '9%',
        cellClass: 'input_center',
        displayName: $translate.instant('NO_CRP'),
      },
      {
        field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
        width: '12%',
        displayName: $translate.instant('FECHA_REGISTRO'),
        cellTemplate: '<div align="center">{{row.entity.OrdenPagoEstadoOrdenPago[0].FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</div>'
      },
      {
        field: 'RegistroPresupuestal.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
        width: '16%',
        displayName: $translate.instant('CODIGO'),
      },
      {
        field: 'RegistroPresupuestal.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Nombre',
        width: '22%',
        displayName: $translate.instant('RUBRO')
      },
      {
        field: 'Necesidad.Dependencia.Nombre',
        width: '22%',
        displayName: $translate.instant('DEPENDENCIA')
      },
      {
        field: 'ValorBase',
        width: '12%',
        displayName: $translate.instant('VALOR'),
        cellTemplate: '<div align="right">{{row.entity.ValorBase| currency}}</div>'
      }

    ]
  };
  self.gridOptionOP.multiSelect = false;

  self.cerrar_ventana = function() {
    $("#myModal").modal('hide');
  };

  self.fuente_seleccionada = {};

  self.cambiar_rubro = function() {

    self.gridOptionCDP.data = [];
    self.gridOptionCRP.data = [];
    self.gridOptionOP.data = [];
    self.fuente_cdp = [];
    self.fuente_cdp_tabla = [];
    self.fuente_crp = [];
    self.fuente_crp_tabla = [];
    self.fuente_op = [];
    self.fuente_op_tabla = [];
    self.movimiento_fuente_financiamiento_apropiacion = [];
    self.fuente_financiamiento_apropiacion = [];

    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id:' + parseInt(self.fuente) + ',Fecha__startswith:' + parseInt(self.Vigencia)).then(function(response) {
    //financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id:' + parseInt(self.fuente)).then(function(response) {
      self.valor_total = 0;
      self.fuente_financiamiento_apropiacion = response.data;
      if (self.fuente_financiamiento_apropiacion) {
        for (i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
          self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion[i].Valor;
        }
      }
    });


    financieraMidRequest.get('disponibilidad/ListaDisponibilidades/' + parseInt(self.Vigencia) + "/", 'limit=-1&UnidadEjecutora=' + parseInt(self.unidad_ejecutora) + '&query=DisponibilidadApropiacion.FuenteFinanciamiento.Id:' + parseInt(self.fuente)).then(function(response) {

      self.fuente_cdp = response.data;
      self.valor_cdp = 0;
      self.valor_disponible = 0;

      for (i = 0; i < self.fuente_cdp.length; i++) {
        for (j = 0; j < self.fuente_cdp[i].DisponibilidadApropiacion.length; j++) {
          self.fuente_cdp[i].DisponibilidadApropiacion[0] = self.fuente_cdp[i].DisponibilidadApropiacion[j];
          self.valor_cdp = self.valor_cdp + self.fuente_cdp[i].DisponibilidadApropiacion[j].Valor;
          self.fuente_cdp_tabla.push(self.fuente_cdp[i]);
        }
      }

      self.valor_disponible = self.valor_total - self.valor_cdp;
      self.gridOptionCDP.data = self.fuente_cdp_tabla;
      self.fuente_cdp = response.data;
    });


    financieraMidRequest.get('registro_presupuestal/ListaRp/' + parseInt(self.Vigencia) + "/", 'limit=-1&UnidadEjecutora=' + parseInt(self.unidad_ejecutora) + '&query=RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Id:' + parseInt(self.fuente)).then(function(response) {

      self.fuente_crp = response.data;

      for (i = 0; i < self.fuente_crp.length; i++) {
        for (j = 0; j < self.fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion.length; j++) {
          self.fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[0] = self.fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[j];
          self.fuente_crp_tabla.push(self.fuente_crp[i]);
        }
      }
      self.gridOptionCRP.data = self.fuente_crp_tabla;
      self.fuente_crp = response.data;

    });

    financieraMidRequest.get('orden_pago/GetOrdenPagoByFuenteFinanciamiento', 'limit=-1&fuente=' + parseInt(self.fuente) + '&vigencia=' + parseInt(self.Vigencia) + '&unidadEjecutora=' + parseInt(self.unidad_ejecutora)).then(function(response) {

      self.fuente_op = response.data.OrdenPago;
      self.gridOptionOP.data = self.fuente_op;

    });

    for (i = 0; i < self.fuente_financiamiento.length; i++) {
      if (self.fuente_financiamiento[i].Id == self.fuente) {
        self.fuente_seleccionada = self.fuente_financiamiento[i];
      }
    }
    for (i = 0; i < self.fuente_cdp.length; i++) {
      self.fuente_cdp[i]
    }
    self.actualizar();
  };

  self.actualizar = function() {
    $timeout(function() {
      $('.selectpicker').selectpicker('refresh');
    });
  };
  self.actualizar();

});
