'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionCuentasBancariasCtrl
 * @description
 * # BancosGestionCuentasBancariasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionCuentasBancariasCtrl', function(coreRequest, financieraRequest, $scope, $translate, uiGridConstants) {
    var ctrl = this;


    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editar_cuenta_bancaria', estado: true },

    ];


    ctrl.CuentasBancarias = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible:false,

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'NumeroCuenta',
          displayName: $translate.instant('NUMERO_CUENTA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'EstadoActivo',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'TipoCuentaBancaria.Nombre',
          displayName: $translate.instant('TIPO_CUENTA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Sucursal',
          displayName: $translate.instant('SUCURSAL'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'CuentaContable',
          displayName: $translate.instant('CUENTA_CONTABLE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
            headerCellClass: 'text-info'
        }
      ]
    };

    ctrl.CuentasBancarias.multiSelect = false;
    ctrl.CuentasBancarias.modifierKeysToMultiSelect = false;
    ctrl.CuentasBancarias.enablePaginationControls = true;
    ctrl.CuentasBancarias.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };

    ctrl.Sucursales = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible:false,

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        ]
    };

    ctrl.Sucursales.multiSelect = false;
    ctrl.Sucursales.modifierKeysToMultiSelect = false;
    ctrl.Sucursales.enablePaginationControls = true;
    ctrl.Sucursales.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };


    ctrl.CuentaContable = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible:false,

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Naturaleza',
          displayName: $translate.instant('NATURALEZA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Codigo',
          displayName: $translate.instant('CODIGO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        ]
    };

    ctrl.CuentaContable.multiSelect = false;
    ctrl.CuentaContable.modifierKeysToMultiSelect = false;
    ctrl.CuentaContable.enablePaginationControls = true;
    ctrl.CuentaContable.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };


    financieraRequest.get('cuenta_bancaria', $.param({
        limit: -1
      })).then(function(response) {
        ctrl.CuentasBancarias.data = response.data;
      });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "editar_cuenta_bancaria":
                  ctrl.mostrar_modal_edicion_cuenta_bancaria(row);
                break;
            case "otro":
                break;
          default:
        }
    };

    ctrl.mostrar_modal_edicion_cuenta_bancaria = function(row){
      coreRequest.get('sucursal', $.param({
          limit: -1
        })).then(function(response) {
          ctrl.Sucursales.data = response.data;
        });

        financieraRequest.get('tipo_cuenta_bancaria', $.param({
            limit: -1
          })).then(function(response) {
            ctrl.TipoCuentaBancaria = response.data;
          });

        financieraRequest.get('cuenta_contable', $.param({
              limit: -1
            })).then(function(response) {
              ctrl.CuentaContable.data = response.data;
            });

        $("#modal_editar_cuenta_bancaria").modal("show");
    };

    ctrl.mostrar_modal_agregar_cuenta_bancaria = function(row){

          coreRequest.get('sucursal', $.param({
              limit: -1
            })).then(function(response) {
              ctrl.Sucursales.data = response.data;
            });

            financieraRequest.get('tipo_cuenta_bancaria', $.param({
                limit: -1
              })).then(function(response) {
                ctrl.TipoCuentaBancaria = response.data;
              });

            financieraRequest.get('cuenta_contable', $.param({
                  limit: -1
                })).then(function(response) {
              ctrl.CuentaContable.data = response.data;
            });

            $("#modal_agregar_cuenta_bancaria").modal("show");

    };

    ctrl.agregar_cuenta_bancaria = function(row){
      alert("agregar cuenta bancaria");
    };

    ctrl.editar_cuenta_bancaria = function(row){
          alert("editar cuenta_bancaria");
    };

  });
