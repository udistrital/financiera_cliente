'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesRelacionCtrl
 * @description
 * # DevolucionesRelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesRelacionCtrl', function ($scope,$translate,financieraRequest,coreRequest) {
    var ctrl = this;
    ctrl.gridApi=[];

    $scope.botones = [
        { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
    ];
    ctrl.gridOrdenes = {
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
              headerCellClass:'text-info',
              visible:false
          },
          {
              field: 'Devolucion.Id',
              displayName: $translate.instant('NUMERO_OPERACION'),
              headerCellClass:'text-info',
              width: '10%'
          },
          {
              field: 'Devolucion.FormaPago.Nombre',
              displayName: $translate.instant('FORMA_PAGO'),
              headerCellClass:'text-info',
              width: '15%',
          },
          {
              field: 'Devolucion.RazonDevolucion.Nombre',
              displayName: $translate.instant('RAZON_DEVOLUCION'),
              headerCellClass:'text-info',
              width: '13%'
          },
          {
              field: 'Devolucion.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '13%'
          },
          {
              field: 'Devolucion.UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'text-info',
              width: '13%'
          },
          {
              field: 'Devolucion.CuentaDevolucion.NumeroCuenta',
              displayName: $translate.instant('CUENTA'),
              headerCellClass:'text-info',
              width: '13%'
          },
          {
              field: 'Soporte[0].Nombre',
              displayName: $translate.instant('SOPORTE'),
              headerCellClass:'text-info',
              width: '13%'
          },
          {
              field: 'valorDevolucion',
              displayName: $translate.instant('VALOR'),
              headerCellClass:'text-info',
              width: '13%',
              cellFilter:"currency",
              cellClass:'ui-grid-number-cell'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '10%',
              headerCellClass:'text-info',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ],
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
      }
    };

    ctrl.consultarListas = function(){
      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        var year = parseInt(response.data);
        ctrl.anos = [];
        for (var i = 0; i < 5; i++) {
          ctrl.anos.push(year - i);
        }
      });

      financieraRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });
    };
    ctrl.consultarListas();

    ctrl.consultarSolicitudes = function(){
        financieraRequest.get('solicitud_devolucion_estado_devolucion',$.param({
          query:"EstadoDevolucion:6,Activo:true",
          limit: -1
        })).then(function(response){
          if(response.data != undefined){
            angular.forEach(response.data,function(row){
              financieraRequest.get('solicitud_devolucion_concepto',$.param({
                query:"SolicitudDevolucion:" + row.Devolucion.Id,
                fields:"ValorDevolucion",
                limit: -1
              })).then(function(response){
                row.valorDevolucion = response.data[0].ValorDevolucion;
              });

              coreRequest.get('documento', $.param({
                query:"Id:"+row.Devolucion.Soporte,
                  limit: -1
              })).then(function(response) {
                  row.Soporte = response.data;
              });
            });
            ctrl.gridOrdenes.data = response.data;
            console.log(ctrl.gridOrdenes.data );
          }
        });
        };

      ctrl.consultarSolicitudes();

      ctrl.insertarOrden = function(){
        ctrl.Solicitudes=[];
        ctrl.gridApi.selection.getSelectedGridRows().forEach(function(row) {
          ctrl.Solicitud = {
            SolicitudDevolucion:{
              Id:row.entity.Devolucion.Id
            }
          };
          ctrl.Solicitudes.push(ctrl.Solicitud);
        });
        ctrl.request={
          ordenDevolucion:{
            Observaciones:ctrl.observaciones,
            ValorTotal:ctrl.valorTotal,
            UnidadEjecutora:ctrl.unidadejecutora,
            Vigencia:ctrl.vigencia
          },
          estadoOrdenDevol:{
          EstadoDevolucion:{Id:1}
          },
          ordenSolicitud:ctrl.Solicitudes
        };
        financieraRequest.post('orden_devolucion/AddDevolutionOrder',ctrl.request).then(function(response) {
          if(response.data.Type != undefined){
                swal('',$translate.instant(response.data.Code),response.data.Type);
                if(response.data.Type != "error"){
                  ctrl.request.ordenDevolucion.Id = response.data.Body.Id;
                  financieraRequest.post('orden_devolucion_estado_devolucion/AddEstadoOrdenDevol',ctrl.request).then(function(response) {
                    console.log(response);
                  });
                }
           }
         });
      };
  });
