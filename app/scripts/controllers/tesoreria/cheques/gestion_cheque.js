'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesGestionChequeCtrl
 * @description
 * # TesoreriaChequesGestionChequeCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesGestionChequeCtrl', function ($scope,$translate,financieraRequest,gridApiService,financieraMidRequest,$interval,uiGridConstants) {
    var ctrl = this;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true }
    ];
    $scope.botonesChequera = [
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg faa-shake animated-hover", titulo: $translate.instant('VER'), operacion: 'ver', estado: true }
    ];
    ctrl.fechaCreacion = new Date();

    ctrl.gridCheque = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'CodigoHomologado',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('CHEQUERA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('ORDEN_PAGO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('BENEFICIARIO'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('FECHA_VENCIMIENTO'),
              headerCellClass:'text-info',
              width: '17%',
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
            width: '12%'
          }
      ]
    }

    ctrl.gridChequeras = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: false,
      multiSelect:false,
      columnDefs: [
          {
              field: 'Chequera.Consecutivo',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '20%'
          },
          {
              field: 'Chequera.UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'Chequera.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '20%'
          },
          {
              field: 'Chequera.CuentaBancaria.Nombre',
              displayName: $translate.instant('CUENTA_BANCARIA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrowChequera(fila,operacion)" grupobotones="grid.appScope.botonesChequera" fila="row"></btn-registro>',
            width: '20%'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiChequeras = gridApi;
        ctrl.gridApiChequeras = gridApiService.pagination(gridApi,ctrl.ObtenerChequeras,$scope);
      },
      isRowSelectable: function(row){
        return row.entity.Chequera.ChequesDisponibles > 0;
      }
    }


    ctrl.gridOrdenesDePago = {
      enableRowSelection: false,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      multiSelect: false,
      enableRowHeaderSelection: false,
      paginationPageSizes: [10, 50, 100],
      paginationPageSize: null,

      enableFiltering: true,
      minRowsToShow: 10,
      useExternalPagination: false,

      columnDefs:[
        {
          field: 'Consecutivo',
          displayName: $translate.instant('CODIGO'),
          width: '14%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
          width: '14%',
          displayName: $translate.instant('TIPO'),
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '14%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '14%',
        },
        {
          field: 'ValorBase',
          width: '14%',
          cellFilter: 'currency',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('VALOR')
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '14%',
          displayName: $translate.instant('ESTADO'),
          filter: {
            //term: 'Elaborado',
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.estado_select

          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '14%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',

        }
      ],

      onRegisterApi: function(gridApi) {
        ctrl.gridApiOP = gridApi;
      }
    };

    ctrl.ObtenerChequeras = function(offset,query){
      financieraMidRequest.cancel();

      if (angular.isUndefined(query) || query === ""){
        query = "Estado.NumeroOrden:1";
      }else {
        query = query + ",Estado.NumeroOrden:1";
      }

      financieraMidRequest.get("gestion_cheques/GetAllChequera",$.param({
        limit: ctrl.gridChequeras.paginationPageSize,
        offset:offset,
        query:query,
        bDisponibles:true
      })).then(function(response){
          ctrl.gridChequeras.data=response.data;
    });
  }
  ctrl.ObtenerChequeras(0,'');

  ctrl.cargarOp = function(offset,query){
    financieraRequest.get('orden_pago', $.param({
      query:query,
      limit: ctrl.gridOrdenesDePago.paginationPageSize,
      offset:offset
    })).then(function(response) {
    if(response.data === null){
      ctrl.hayDataOP = false;
      ctrl.cargandoOP = false;
      ctrl.gridOrdenesDePago.data = [];
    }else{
      ctrl.hayDataOP = true;
      ctrl.cargandoOP = false;
      ctrl.gridOrdenesDePago.data = response.data;
    }
    });
  }
ctrl.cargarOp(0,'FormaPago.CodigoAbreviacion:CH');
    $scope.$watch('tesoreriaGestionCheque.concepto[0]', function(oldValue, newValue) {
        if (!angular.isUndefined(newValue)) {
            financieraRequest.get('concepto', $.param({
                query: "Id:" + newValue.Id,
                fields: "Rubro",
                limit: -1
            })).then(function(response) {
                $scope.tesoreriaGestionCheque.concepto[0].Rubro = response.data[0].Rubro;
            });
        }
    }, true);

    $scope.loadrowChequera = function(row, operacion) {
        $scope.chequera = row.entity.Chequera;
        switch (operacion) {
            case "ver":
                $("#datosChequera").modal();
                break;
            default:
        }
    }

    ctrl.ajustarGrid = function() {
      $interval( function() {
          ctrl.gridApiChequeras.core.handleWindowResize();
        }, 500, 2);
    }

  });
