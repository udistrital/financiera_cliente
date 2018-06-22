'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionDetalleFuenteCtrl
 * @description
 * # FuenteFinanciacionDetalleFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp').controller('detalleFuenteCtrl', function($window, $timeout, $scope, $translate, financieraMidRequest, financieraRequest, oikosRequest, coreRequest, $localStorage) {

  var self = this;
  var i;
  var j;
  self.fuente = $localStorage.fuente.Id;
  self.Nombre = $localStorage.fuente.Nombre;
  self.Codigo = $localStorage.fuente.Codigo;
  self.TipoFuenteFinanciamiento = $localStorage.fuente.TipoFuenteFinanciamiento.Nombre;
  self.Vigencia = $localStorage.fuente.Vigencia;
  self.valor_cdp = $localStorage.fuente.valor_cdp;
  self.unidad_ejecutora = 1;

  self.cargando = false;
  self.hayData = true;

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
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('NO'),
      },
      {
        field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Numero',
        width: '10%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('NECESIDAD_NO'),
      },
      {
        field: 'FechaRegistro',
        width: '12%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('FECHA_REGISTRO'),
        cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</div>'
      },
      {
        field: 'DisponibilidadApropiacion[0].Apropiacion.Rubro.Codigo',
        width: '17%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('CODIGO')
      },
      {
        field: 'DisponibilidadApropiacion[0].Apropiacion.Rubro.Nombre',
        width: '22%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('RUBRO')
      },
      {
        field: 'Solicitud.DependenciaSolicitante.Nombre',
        width: '22%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('DEPENDENCIA_SOLICITANTE')
      },
      {
        field: 'DisponibilidadApropiacion[0].Valor',
        width: '12%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
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
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('NO'),
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
        width: '6%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('NO_CDP'),
      },
      {
        field: 'InfoSolicitudDisponibilidad.SolicitudDisponibilidad.Necesidad.Numero',
        width: '10%',
        headerCellClass: 'encabezado',
        cellClass: 'input_center',
        displayName: $translate.instant('NECESIDAD_NO'),
      },
      {
        field: 'FechaRegistro',
        width: '11%',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('FECHA_REGISTRO'),
        cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</div>',
        cellClass: 'input_center',
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
        width: '15%',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('CODIGO'),
        cellClass: 'input_center',
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Nombre',
        width: '20%',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('RUBRO'),
        cellClass: 'input_center',
      },
      {
        field: 'InfoSolicitudDisponibilidad.DependenciaSolicitante.Nombre',
        width: '20%',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
        cellClass: 'input_center',
      },
      {
        field: 'RegistroPresupuestalDisponibilidadApropiacion[0].Valor',
        width: '12%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
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
        headerCellClass: 'encabezado',
        displayName: $translate.instant('NO'),
      },
      {
        field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
        width: '9%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('NO_CRP'),
      },
      {
        field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
        width: '12%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('FECHA_REGISTRO'),
        cellTemplate: '<div align="center">{{row.entity.OrdenPagoEstadoOrdenPago[0].FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</div>'
      },
      {
        field: 'RegistroPresupuestal.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
        width: '16%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('CODIGO'),
      },
      {
        field: 'RegistroPresupuestal.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Nombre',
        width: '22%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('RUBRO')
      },
      {
        field: 'Necesidad.Dependencia.Nombre',
        width: '22%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('DEPENDENCIA')
      },
      {
        field: 'ValorBase',
        width: '12%',
        cellClass: 'input_center',
        displayName: $translate.instant('VALOR'),
        cellTemplate: '<div align="right">{{row.entity.ValorBase| currency}}</div>',
        headerCellClass: 'encabezado',
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
         self.valor_disponible = self.valor_total - self.valor_cdp;
    });

};

  self.cambiar_rubro();


  self.mostrar_CDP = function(){

    self.gridOptionCDP.data  = [];
    self.cargando = true;
    self.hayData = true;

    financieraMidRequest.get('disponibilidad/ListaDisponibilidades/' + parseInt(self.Vigencia) + "/", 'limit=-1&UnidadEjecutora=' + parseInt(self.unidad_ejecutora) + '&query=DisponibilidadApropiacion.FuenteFinanciamiento.Id:' + parseInt(self.fuente)).then(function(response) {


        if(response.data.Type === "error"){
          self.hayData = false;
          self.cargando = false;
          self.gridOptionCDP.data  = [];
        }else{
         self.fuente_cdp = response.data;

         for (i = 0; i < self.fuente_cdp.length; i++) {
           for (j = 0; j < self.fuente_cdp[i].DisponibilidadApropiacion.length; j++) {
             self.fuente_cdp[i].DisponibilidadApropiacion[0] = self.fuente_cdp[i].DisponibilidadApropiacion[j];

             self.fuente_cdp_tabla.push(self.fuente_cdp[i]);
           }
         }

         self.hayData = true;
         self.cargando = false;
         self.gridOptionCDP.data = self.fuente_cdp_tabla;
         self.fuente_cdp = response.data;

       }
    });
  };

  self.mostrar_CRP = function(){

    self.gridOptionCRP.data  = [];
    self.cargando = true;
   self.hayData = true;

        financieraMidRequest.get('registro_presupuestal/ListaRp/' + parseInt(self.Vigencia) + "/", 'limit=-1&UnidadEjecutora=' + parseInt(self.unidad_ejecutora) + '&query=RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Id:' + parseInt(self.fuente)).then(function(response) {

            console.log("no data ",response.data)
          if(response.data.Type === "error"){
            self.hayData = false;
            self.cargando = false;
            self.gridOptionCRP.data.data  = [];
          }else{
          self.fuente_crp = response.data;

          for (i = 0; i < self.fuente_crp.length; i++) {
            for (j = 0; j < self.fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion.length; j++) {
              self.fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[0] = self.fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[j];
              self.fuente_crp_tabla.push(self.fuente_crp[i]);
            }
          }

          self.hayData = true;
          self.cargando = false;
          self.gridOptionCRP.data = self.fuente_crp_tabla;
          self.fuente_crp = response.data;
        }

        });
  };

  self.mostrar_OP = function(){

    self.gridOptionOP.data = [];
    self.cargando = true;
    self.hayData = true;

        financieraMidRequest.get('orden_pago/GetOrdenPagoByFuenteFinanciamiento', 'limit=-1&fuente=' + parseInt(self.fuente) + '&vigencia=' + parseInt(self.Vigencia) + '&unidadEjecutora=' + parseInt(self.unidad_ejecutora)).then(function(response) {

            console.log("no data ",response.data)
          if(response.data === null){
            self.hayData = false;
            self.cargando = false;
            self.gridOptionOP.data = [];
          }else{

            self.hayData = true;
            self.cargando = false;
            self.fuente_op = response.data.OrdenPago;
            self.gridOptionOP.data = self.fuente_op;

          }
        });

  };


});
