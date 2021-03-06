'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoGirosGirosVerPorIdCtrl
 * @description
 * # OrdenPagoGirosGirosVerPorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GirosVerPorIdCtrl', function($scope, financieraRequest, financieraMidRequest, gridApiService, uiGridConstants, agoraRequest, coreRequest, $routeParams, $timeout, $translate, $window) {
    var self = this;
    self.giroId = $routeParams.Id;
    self.tipoDocumentoOp = "1";
    self.tipoDocumentoGiro = "11";
    self.conceptos = [];
    self.cuentas = [];
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    //
    self.gridOptions_op_detail = {
      showColumnFooter: true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,

      paginationPageSizes: [10, 30, 50],
      paginationPageSize: 10,

      enableFiltering: true,
      enableSelectAll: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      minRowsToShow: 15,
      useExternalPagination: false,

      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'OrdenPago.Consecutivo',
          displayName: $translate.instant('CONSECUTIVO') + ' ' +$translate.instant('GIRO'),
          width: '10%',
          sort: {
            direction: 'asc',
            priority: 0
          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'TipoMov',
          width: '8%',
          displayName: $translate.instant('TIPO'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPago.Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPago.OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellTemplate: '<span>{{row.entity.OrdenPago.OrdenPagoEstadoOrdenPago[0].FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
          width: '8%',
        },
        {
          field: 'OrdenPago.RegistroPresupuestal.NumeroRegistroPresupuestal',
          displayName: $translate.instant('NO_CRP'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPago.FormaPago.CodigoAbreviacion',
          width: '5%',
          displayName: $translate.instant('FORMA_PAGO'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'InfoProveedor[0].Tipopersona',
          width: '10%',
          displayName: $translate.instant('TIPO_PERSONA'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'InfoProveedor[0].NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'InfoProveedor[0].NumDocumento',
          width: '10%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('NO_DOCUMENTO')
        },
        {
          field: 'ValorBasePago',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('VALOR'),
        },
        {
          field: 'OrdenPago.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '8%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
        },
      ]
    };
    self.gridOptions_op_detail.enablePaginationControls = true;
    self.gridOptions_op_detail.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      self.gridApi = gridApiService.pagination(self.gridApi, self.cargarListaGiro, $scope);
    };


    self.cargarListaGiro = function (offset,query) {
    financieraMidRequest.cancel();
    // giros data
    financieraMidRequest.get('giro/GetGirosById/'+self.giroId,
      $.param({
        limit: self.gridOptions_op_detail.paginationPageSize,
        offset: offset,
        query: query,
      })
    ).then(function(response) {
      self.gridOptions_op_detail.data = response.data;
      if (self.giros === undefined || self.giros === ''){
      self.giros = self.gridOptions_op_detail.data[0].Giro;
      // data sucursal y banco
      financieraMidRequest.get('cuentas_bancarias',
        $.param({
          query: "Sucursal:" + self.giros.CuentaBancaria.Sucursal,
          limit: 1,
        })).then(function(response) {
        self.giros.Organizacion = response.data[0];
      })
      }
      //
      self.ValorTotal = 0;
      self.ValorTotalOp = 0;
      self.ValorTotalCuentasEspeciales = 0;
      self.FormaPago = self.gridOptions_op_detail.data[0].OrdenPago.FormaPago;
      // data for ordenes
      financieraMidRequest.get('giro/GetSumGiro/'+self.giroId).then(function(response){
        self.ValorTotalOp = response.data[0].total_op
        self.ValorTotalCuentasEspeciales = response.data[0].total_cuentas_especiales;
        self.ValorTotal = parseInt(self.ValorTotalOp) + parseInt(self.ValorTotalCuentasEspeciales);
      });
      // data proveedor


    });
    };
    $scope.loadrow = function(row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
          case "ver":
          $("#myModal").modal();
            $scope.movimientos = [];
            self.data = null;
            self.data = row.entity;
/*           financieraRequest.get('movimiento_contable','query=TipoDocumentoAfectante:1'+',CodigoDocumentoAfectante:'+ self.data.OrdenPago.Id+'&sortby=id&order=asc').then(function(response) {

            angular.forEach(response.data, function(data){
              if($scope.movimientos.indexOf(data) === -1) {
                  $scope.movimientos.push(data);
              }
              });
          }); */
              break;

          case "otro":

          break;
          default:
      }
  };
    self.cargarListaGiro(0,'');


    //
  });
