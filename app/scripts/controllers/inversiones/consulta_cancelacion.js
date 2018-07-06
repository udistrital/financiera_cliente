'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesConsultaCancelacionCtrl
 * @description
 * # InversionesConsultaCancelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesConsultaCancelacionCtrl', function ($scope,$translate,financieraMidRequest,gridApiService,financieraRequest) {
    var ctrl = this;

    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};

    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_DETALLE'), operacion: 'verObservacion', estado: true },
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true }
    ];

    ctrl.gridInversiones = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      useExternalPagination: true,
      columnDefs: [{
              field: 'CancelacionInversion.Id',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '*',
          },
          {
              field:'CancelacionInversion.FechaCancelacion',
              displayName: $translate.instant('FECHA_CANCELACION'),
              cellFilter: "date:'yyyy-MM-dd'",
              headerCellClass:'text-info',
              width: '*',
          },
          {
              field:'CancelacionInversion.UnidadEjecutora',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'text-info',
              width: '*',
          },
          {
              field:'CancelacionInversion.Vigencia',
              displayName: $translate.instant('Vigencia'),
              headerCellClass:'text-info',
              width: '*'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '*',
              headerCellClass:'text-info',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi = gridApiService.pagination(gridApi,ctrl.consultarCancelaciones,$scope);
      }
    };

    ctrl.consultarCancelacion = function(offset,query){
      financieraMidRequest.cancel();
      financieraMidRequest.get('inversion/GetAllCancelaciones',$.param({
        limit:ctrl.gridInversiones.paginationPageSize,
        offset:offset,
        query:query
      })).then(function(response){
        console.log(response.data)
        ctrl.gridInversiones.data = response.data;
      });
    }
    ctrl.consultarCancelacion(0,null);

    ctrl.cargarEstados = function() {
      financieraRequest.get("estado_cancelacion_inversion", $.param({
              sortby: "NumeroOrden",
              limit: -1,
              order: "asc"
          }))
          .then(function(response) {
              $scope.estados = [];
              $scope.aristas = [];
              ctrl.estados = response.data;
              angular.forEach(ctrl.estados, function(estado) {
                  $scope.estados.push({
                      id: estado.Id,
                      label: estado.Nombre
                  });
                  $scope.estado_select.push({
                      value: estado.Nombre,
                      label: estado.Nombre,
                      estado: estado
                  });
              });
              $scope.aristas = [{
                      from: 1,
                      to: 2
                  },
                  {
                      from: 1,
                      to: 3
                  }
              ];
          });
    }

    ctrl.cargarEstados();

    $scope.loadrow = function(row, operacion) {
        $scope.cancelacion = row.entity;
        switch (operacion) {
            case "proceso":
                $scope.estado = $scope.cancelacion.EstadoCancelacionInversion ;
                break;
            default:
        }
    };

  });
