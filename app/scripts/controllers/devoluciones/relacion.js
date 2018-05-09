'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesRelacionCtrl
 * @description
 * # DevolucionesRelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesRelacionCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    ctrl.gridApi=[];

    $scope.botones = [
        { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        //{ clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
        //{ clase_color: "ver", clase_css: "fa fa-check fa-lg faa-shake animated-hover", titulo: $translate.instant('LEGALIZAR'), operacion: 'legalizar', estado: true }

    ];
    ctrl.gridOrdenes = {
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          if(angular.isUndefined(ctrl.valorTotal)){
              ctrl.valorTotal = 0;
          }
          if(row.isSelected){
            ctrl.valorTotal = ctrl.valorTotal + row.entity.valorDevolucion;
          }
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(row) {
          ctrl.valorTotal=0;
          gridApi.selection.getSelectedGridRows().forEach(function(row) {
                ctrl.valorTotal= ctrl.valorTotal + row.entity.valorDevolucion;
              });
          });
      },
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 35,
      columnDefs: [{
              field: 'Solicitante',
              displayName: 'Solicitante',
              width: '5%',
              visible:false
          },
          {
              field: 'Beneficiario',
              displayName: 'Beneficiario',
              width: '10%',
              visible:false
          },
          {
              field: 'Id',
              displayName: $translate.instant('NUMERO_OPERACION'),
              width: '10%'
          },
          {
              field: 'FormaPago.Nombre',
              displayName: $translate.instant('FORMA_PAGO'),
              width: '15%',
          },
          {
              field: 'RazonDevolucion.Nombre',
              displayName: $translate.instant('RAZON_DEVOLUCION'),
              width: '13%'
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '13%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              width: '13%'
          },
          {
              field: 'CuentaDevolucion.NumeroCuenta',
              displayName: $translate.instant('CUENTA'),
              width: '13%'
          },
          {
              field: 'Soporte.Nombre',
              displayName: $translate.instant('SOPORTE'),
              width: '13%'
          },
          {
              field: 'valorDevolucion',
              displayName: $translate.instant('VALOR'),
              width: '13%'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '10%',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };


    ctrl.consultarSolicitudes = function(){
        financieraRequest.get('solicitud_devolucion',$.param({
          limit: -1
        })).then(function(response){
          if(response.data != undefined){
            console.log(response.data);
            angular.forEach(response.data,function(row){
              financieraRequest.get('solicitud_devolucion_concepto',$.param({
                query:"SolicitudDevolucion:" + row.Id,
                fields:"ValorDevolucion",
                limit: -1
              })).then(function(response){
                row.valorDevolucion = response.data[0].ValorDevolucion;
              });

            });
            ctrl.gridOrdenes.data = response.data;
          }
        });
        };

        ctrl.consultarSolicitudes();

      ctrl.insertarOrden = function(){
        ctrl.ordenSolicitudes=[];

        ctrl.gridApi.selection.getSelectedGridRows().forEach(function(row) {
          ctrl.ordenSolicitud = {
            SolicitudDevolucion:{
              Id:row.entity.Id
            }
          };
          ctrl.ordenSolicitudes.push(ctrl.ordenSolicitud);
        });
        console.log(ctrl.ordenSolicitudes);
      };

  });
