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
              cellClass: 'input_center',
              visible:false
          },
          {
              field: 'Beneficiario',
              displayName: 'Beneficiario',
              width: '10%',
              headerCellClass:'encabezado',
              cellClass: 'input_center',
              visible:false
          },
          {
              field: 'Devolucion.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'encabezado',
              cellClass: 'input_center',
              width: '20%'
          },
          {
              field: 'Devolucion.Id',
              displayName: $translate.instant('NUMERO_OPERACION'),
              headerCellClass:'encabezado',
              cellClass: 'input_center',
              width: '20%'
          },

          {
              field: 'Devolucion.UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'encabezado',
              cellClass: 'input_center',
              width: '30%'
          },

          {
              field: 'valorDevolucion',
              displayName: $translate.instant('VALOR'),
              headerCellClass:'encabezado',
              cellClass: 'input_right',
              width: '15%',
              cellFilter:"currency",

          },
          {
              name: $translate.instant('OPCIONES'),
              width: '12%',
              headerCellClass:'encabezado',
              cellClass: 'input_center',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var arreglo_seleccionados= ctrl.gridApi.selection.getSelectedRows();
            ctrl.valorTotal = 0;
            ctrl.sumarValores(arreglo_seleccionados);
        });


      }
    };

    $scope.loadrow = function(row, operacion) {
      ctrl.fila = row.entity;
      switch (operacion) {

          case "ver":
              $('#modal_ver').modal('show');
              break;
          case "otro":

                break;
            default:
        }
    };

    ctrl.sumarValores = function(arreglo){

        angular.forEach(arreglo,function(pos){
          ctrl.valorTotal = ctrl.valorTotal + pos.valorDevolucion;
        });
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
          }
        });
        };

      ctrl.consultarSolicitudes();

      ctrl.camposObligatorios = function() {
        var respuesta;
        ctrl.MensajesAlerta = '';

        if($scope.datosOblig.$invalid){
          angular.forEach($scope.datosOblig.$error,function(controles,error){
            angular.forEach(controles,function(control){
              control.$setDirty();
            });
          });

          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
        }

        if(ctrl.valorTotal === 0 || ctrl.valorTotal === undefined){
            ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("SELECCIONAR_ORDEN_DEV") + "</li>";
        }
        // Operar
        if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
          respuesta = true;
        } else {
          respuesta =  false;
        }

        return respuesta;
      };


      ctrl.insertarOrden = function(){

      if (ctrl.camposObligatorios()) {
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
       }else{
         swal({
           title: '¡Error!',
           html: '<ol align="left">' + ctrl.MensajesAlerta + '</ol>',
           type: 'error'
         })
       }
      };
  });
