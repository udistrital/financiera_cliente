'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionBancosCtrl
 * @description
 * # BancosGestionBancosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionBancosCtrl', function(coreRequest, $scope, $translate, uiGridConstants, $location, $route) {
    var ctrl = this;


    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-plus fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.AGREGAR_CODIGOS'), operacion: 'agregar_codigos', estado: true },
        { clase_color: "editar", clase_css: "fa fa-home fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_SUCURSAL'), operacion: 'ver_sucursal', estado: true },
    ];


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

        }
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

    ctrl.gridOptions = {
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
          field: 'Nit',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          displayName: $translate.instant('NIT'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        /*{
          field: 'DenominacionBanco',
          displayName: $translate.instant('DENOMINACION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '20%'
        },*/
        {
          field: 'NombreBanco',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '30%'
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '39%'
        },
        /*{
          field: 'CodigoAch',
          displayName: $translate.instant('ACH'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '5%'
        },
        {
          field: 'CodigoSuperintendencia',
          displayName: $translate.instant('CODIGO_SUPER'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },*/
        {
          field: 'EstadoActivo',
          displayName: $translate.instant('ACTIVO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.EstadoActivo" disabled></center>',
          width: '8%'
        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
            headerCellClass: 'text-info'
        }
      ]
    };

    //opciones extras para el control del grid
    ctrl.gridOptions.multiSelect = false;
    ctrl.gridOptions.modifierKeysToMultiSelect = false;
    ctrl.gridOptions.enablePaginationControls = true;
    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        ctrl.cuenta = ctrl.gridApi.selection.getSelectedRows()[0];
      });
    };

    coreRequest.get('banco', $.param({
        limit: -1
      })).then(function(response) {
        ctrl.gridOptions.data = response.data;
      });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "agregar_codigos":
                  ctrl.agregar_codigos(row);
                break;
            case "ver_sucursal":
                  ctrl.ver_sucursal(row);
                break;
          default:
        }
    };

    ctrl.agregar_codigos = function(row){
      alert("agregar codigos");
    };

    ctrl.ver_sucursal = function(row){

      coreRequest.get('sucursal', $.param({
        query: "Banco:" + row.entity.Id,
        field: "Id,Nombre",
        limit: -1
      })).then(function(response) {
        if(response.data == null){
          ctrl.tieneSucursal = false;
        }else{
          ctrl.tieneSucursal = true;
          ctrl.NombreSucursal = response.data[0].Nombre;
          console.log("nombre", ctrl.NombreSucursal)
        }

      });
      $("#modal_sucursal").modal("show");
      //Si tiene, que permita visualizarla en un modal, en este modal, que se permita desvincularla. Si no tiene, que sea un botón que permite agregar, listando las existentes
    };

    ctrl.desvincular_sucursal = function(){
      alert("desvinculando sucursal")
    };

    ctrl.mostrar_sucursales = function(){
      ctrl.ver_grid_sucursales = true;

      coreRequest.get('sucursal', $.param({
        limit: -1
      })).then(function(response) {
        if(response.data == null){
          alert("no hay")
        }else{
          ctrl.Sucursales.data = response.data;
        }

      });

    };

    ctrl.vincular_sucursal = function(){
      alert("vincular_sucursal")
    };

    ctrl.gestionar_sucursales = function(){
      $location.path('/bancos/gestion_sucursales');
      $route.reload()

    };
  });
