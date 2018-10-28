'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoGirosGirosVerPorIdCtrl
 * @description
 * # OrdenPagoGirosGirosVerPorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GirosVerPorIdCtrl', function($scope, financieraRequest, uiGridConstants, agoraRequest, coreRequest, $routeParams, $timeout, $translate, $window) {
    var self = this;
    self.giroId = $routeParams.Id;
    //
    self.gridOptions_op_detail = {
      showColumnFooter: true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,

      paginationPageSizes: [15, 30, 45],
      paginationPageSize: null,

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
          displayName: $translate.instant('CODIGO'),
          width: '7%',
          sort: {
            direction: 'asc',
            priority: 0
          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPago.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
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
          cellFilter: "date:'yyyy-MM-dd'",
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
          field: 'Proveedor.Tipopersona',
          width: '10%',
          displayName: $translate.instant('TIPO_PERSONA'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Proveedor.NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Proveedor.NumDocumento',
          width: '10%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('NO_DOCUMENTO')
        },
        {
          field: 'OrdenPago.ValorBase',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('VALOR'),

          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          footerCellClass: 'input_right'
        },
        {
          field: 'OrdenPago.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
      ]
    };
    self.gridOptions_op_detail.enablePaginationControls = true;
    self.gridOptions_op_detail.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        $scope.outputopselect = row.entity;
      });
    };
    // giros data
    financieraRequest.get('giro',
      $.param({
        query: "Id:" + self.giroId,
        limit: -1,
      })
    ).then(function(response) {
      self.giros = response.data[0];
      // data sucursal y banco
      coreRequest.get('sucursal',
        $.param({
          query: "Id:" + self.giros.CuentaBancaria.Sucursal,
          limit: -1,
        })).then(function(response) {
        self.giros.SucursalData = response.data[0];
      })
      //
      self.gridOptions_op_detail.data = self.giros.GiroDetalle;
      self.ValorTotal = 0;
      self.FormaPago = self.gridOptions_op_detail.data[0].OrdenPago.FormaPago;
      // data for ordenes
      angular.forEach(self.gridOptions_op_detail.data, function(iterador) {
        if (iterador.CuentaEspecial.Id == 0) {

        self.ValorTotal = self.ValorTotal + iterador.OrdenPago.ValorBase;
        console.log(iterador);
        console.log(iterador.CuentaEspecial.Id);
        agoraRequest.get('informacion_proveedor',
          $.param({
            query: "Id:" + iterador.OrdenPago.OrdenPagoRegistroPresupuestal[0].RegistroPresupuestal.Beneficiario,

          })
        ).then(function(response) {
          iterador.Proveedor = response.data[0];
        });
        financieraRequest.get('orden_pago',
          $.param({
            query: "Id:" + iterador.OrdenPago.Id,
            limit: 1,
          })
        ).then(function(response) {
          iterador.OrdenPago.OrdenPagoEstadoOrdenPago = response.data[0].OrdenPagoEstadoOrdenPago;
        })
        }

      })
      // data proveedor


    })
    //
  });
