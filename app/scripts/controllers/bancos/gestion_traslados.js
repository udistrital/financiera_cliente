'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionTrasladosCtrl
 * @description
 * # BancosGestionTrasladosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionTrasladosCtrl', function(administrativaRequest,coreRequest, $scope, $translate, uiGridConstants, $location, $route) {
    var ctrl = this;


    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver_traslado', estado: true },
    ];


    ctrl.Traslados = {
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
          displayName: 'Id',

        },
        {
          field: 'NumeroTraslado',
          displayName: $translate.instant('NUMERO_TRASLADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Fecha',
          displayName: $translate.instant('VIGENCIA'),
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

    ctrl.Traslados.multiSelect = false;
    ctrl.Traslados.modifierKeysToMultiSelect = false;
    ctrl.Traslados.enablePaginationControls = true;
    ctrl.Traslados.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };

    administrativaRequest.get('informacion_persona_juridica_tipo_entidad/', $.param({
        limit: -1,
        query: "TipoEntidadId:1",
      })).then(function(response) {
        ctrl.Traslados.data = response.data;
      });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "ver_traslado":
                  $('#modal_ver').modal('show');
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

    ctrl.mostrar_traslados = function(){
      ctrl.ver_grid_traslados = true;

      coreRequest.get('sucursal', $.param({
        limit: -1
      })).then(function(response) {
        if(response.data == null){
          alert("no hay")
        }else{
          ctrl.Traslados.data = response.data;
        }

      });

    };

    ctrl.vincular_sucursal = function(){
      alert("vincular_sucursal")
    };

    ctrl.gestionar_traslados = function(){
      $location.path('/bancos/gestion_traslados');
      $route.reload()

    };

    ctrl.gestionar_cuentas_bancarias = function(){
      $location.path('/bancos/gestion_cuentas_bancarias');
      $route.reload()

    };
  });
