'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp').controller('consultaFuenteCtrl', function($window, $scope, $translate,$location,$route, financieraMidRequest, financieraRequest, oikosRequest, coreRequest, $localStorage) {

  var self = this;
  var i;
  var j;
  self.cargando = false;
  self.hayData = true;
  self.cargando_apropiaciones = false;
  self.hayData_apropiaciones = true;
  self.valor_cdp = 0;
  self.valor_disponible = 0;
  self.unidad_ejecutora = 1;
  $scope.botones = [
    { clase_color: "ver", clase_css: "fa fa-info-circle fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_RUBROS'), operacion: 'ver_rubros', estado: true },
    { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLE'), operacion: 'ver_detalle', estado: true },

  ];

  self.gridOptions = {
    enableFiltering: true,
    enableSorting: true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    paginationPageSizes: [5, 10, 15],
    paginationPageSize: 10,

    columnDefs: [{
        field: 'Id',
        visible: false
      },
      {
        displayName: $translate.instant('CODIGO'),
        field: 'Codigo',
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        displayName: $translate.instant('TIPO'),
        field: 'TipoFuenteFinanciamiento.Nombre',
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        displayName: $translate.instant('NOMBRE'),
        field: 'Nombre',
        width: '30%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        displayName: $translate.instant('DESCRIPCION'),
        field: 'Descripcion',
        width: '40%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
          field: 'Opciones',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'encabezado',
          width: "10%",
      }
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
    paginationPageSize: 5,

    columnDefs: [{
        field: 'Id',
        visible: false
      },
      {
        field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Codigo',
        width: '18%',
        displayName: $translate.instant('CODIGO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Nombre',
        width: '25%',
        displayName: $translate.instant('RUBRO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        field: 'FuenteFinanciamientoApropiacion.Dependencia.Nombre',
        width: '25%',
        displayName: $translate.instant('DEPENDENCIA'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        displayName: $translate.instant('FECHA'),
        field: 'Fecha',
        width: '10%',
        cellTemplate: '<div align="center">{{row.entity.Fecha | date:"yyyy-MM-dd":"UTC"}}</div>',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        field: 'TipoMovimiento.Nombre',
        width: '10%',
        displayName: $translate.instant('MOVIMIENTO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        field: 'TipoDocumento.TipoDocumento.Nombre',
        width: '15%',
        displayName: $translate.instant('TIPO_DOCUMENTO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        field: 'TipoDocumento.JsonContenido.Documento.NoDocumento',
        width: '15%',
        displayName: $translate.instant('NO_DOCUMENTO'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        displayName: $translate.instant('FECHA_DOCUMENTO'),
        field: 'TipoDocumento.JsonContenido.Documento.Fecha',
        width: '15%',
        cellTemplate: '<div align="center">{{row.entity.TipoDocumento.JsonContenido.Documento.Fecha | date:"yyyy-MM-dd":"UTC"}}</div>',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      },
      {
        field: 'Valor',
        cellTemplate: '<div align="right">{{row.entity.Valor | currency}}</div>',
        displayName: $translate.instant('VALOR'),
        width: '15%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
      }

    ]
  };
  self.gridOptionsapropiacion.multiSelect = false;

  $scope.loadrow = function(row, operacion) {
    self.operacion = operacion;
    switch (operacion) {
        case "ver_rubros":
            self.mostrar_rubros(row.entity);

        break;

        case "ver_detalle":
            self.mostrar_detalle_fuente(row)
        break;


        default:
    }
};

  self.cerrar_ventana = function() {
    $("#myModal").modal('hide');
  };

  self.consulta_fuente_vigencia = function() {
    self.gridOptions.data = [];
    self.cargando = true;
    self.hayData = true;
    self.fuente_financiamiento = [];
    self.movimiento_fuente_financiamiento_apropiacion = [];

    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=Fecha__startswith:' + parseInt(self.Vigencia)).then(function(response) {
      if(response.data == null){
        self.hayData = false;
        self.cargando = false;
        self.gridOptions.data = [];
      }else{

        self.hayData = true;
        self.cargando = false;
      self.movimiento_fuente_financiamiento_apropiacion = response.data;
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
      console.log("self", self.gridOptions.data)
    }
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

  self.mostrar_rubros = function(e){
    self.valor_total = 0;
    self.fuente_seleccionada = e;
    self.cambiar_rubro(e);

  };

 self.cambiar_rubro = function(fuente) {
    self.gridOptionsapropiacion.data = [];
    self.cargando_apropiaciones = true;
    self.hayData_apropiaciones = true;

    if (fuente.TipoFuenteFinanciamiento.Nombre == "Inversión") {
      self.tipo_fuente = $translate.instant('INVERSION');
    } else {
      self.tipo_fuente = $translate.instant('FUNCIONAMIENTO');
    }
    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id:' + parseInt(fuente.Id) + ',Fecha__startswith:' + parseInt(self.Vigencia)).then(function(response) {

      if(response.data == null){
        self.cargando_apropiaciones = false;
        self.hayData_apropiaciones = false;
        self.gridOptionsapropiacion.data = [];
      }
      else{
        self.cargando_apropiaciones = false;
        self.hayData_apropiaciones = true;
        self.gridOptionsapropiacion.data = response.data;
        $("#myModal").modal("show");
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
        });
      });
      self.valor_total = 0;
      self.fuente_financiamiento_apropiacion1 = response.data;
      if (self.fuente_financiamiento_apropiacion1) {
        for (var i = 0; i < self.fuente_financiamiento_apropiacion1.length; i++) {
          self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion1[i].Valor;
        }
      }

    }
    });
  };

  self.crear_fuente = function(){
    $location.path('/fuente_financiacion/crear_fuente');
    $route.reload()
  };

  self.mostrar_detalle_fuente = function(row){

    //self.calcular_valor_CDP(row.entity.Id);

    self.fuente = {};
    self.fuente.Id = row.entity.Id;
    self.fuente.Vigencia = self.Vigencia;
    self.fuente.TipoFuenteFinanciamiento = {};
    self.fuente.TipoFuenteFinanciamiento.Nombre = row.entity.TipoFuenteFinanciamiento.Nombre;
    self.fuente.Nombre = row.entity.Nombre;
    self.fuente.Codigo = row.entity.Codigo;
  //  self.fuente.valor_cdp = self.valor_cdp;
    $localStorage.fuente = self.fuente;
    console.log("local", $localStorage.fuente)
    $location.path('/fuente_financiacion/detalle_fuente');
    $route.reload()
  };

  self.mostrar_modificar_fuente = function(){
    $location.path('/fuente_financiacion/modificacion_fuente');
    $route.reload()
  };


});
