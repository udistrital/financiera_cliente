'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesConsultaDevolucionesTributariasCtrl
 * @description
 * # DevolucionesConsultaDevolucionesTributariasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesConsultaDevolucionesTributariasCtrl', function ($scope,$translate,financieraRequest,$localStorage,financieraMidRequest,gridApiService) {
    var ctrl = this;

    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};

    $scope.botones = [
        { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
        { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    ctrl.gridDevoluciones = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSelectAll: true,
      useExternalPagination:true,
      selectionRowHeaderWidth: 35,
      columnDefs: [{
              field: 'Solicitante',
              displayName: 'Solicitante',
              width: '5%',
              headerCellClass: 'encabezado',
              visible:false
          },
          {
              field: 'Beneficiario',
              displayName: 'Beneficiario',
              width: '15%',
              headerCellClass: 'encabezado',
              visible:false
          },
          {
              field: 'Id',
              displayName: $translate.instant('NUMERO_OPERACION'),
              headerCellClass: 'encabezado',
              width: '10%'
          },
          {
              field: 'FormaPago.Nombre',
              displayName: $translate.instant('FORMA_PAGO'),
              headerCellClass: 'encabezado',
              width: '15%',
          },
          {
              field: 'DocumentoGenerador.NumDocumento',
              displayName: $translate.instant('NO_OFICIO'),
              headerCellClass: 'encabezado',
              width: '10%'
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass: 'encabezado',
              width: '13%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass: 'encabezado',
              width: '10%'
          },
          {
              field: 'CuentaDevolucion.NumeroCuenta',
              displayName: $translate.instant('CUENTA'),
              headerCellClass: 'encabezado',
              width: '10%'
          },
          {
              field: 'Acta.Nombre',
              displayName: $translate.instant('ACTA'),
              headerCellClass: 'encabezado',
              width: '10%'
          },
          {
              field: 'ValorDevolucion',
              displayName: $translate.instant('VALOR'),
              headerCellClass: 'encabezado',
              cellFilter:"currency",
              width: '10%'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '10%',
              headerCellClass: 'encabezado',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiDevoluciones = gridApi;
        ctrl.gridApiDevoluciones = gridApiService.pagination(gridApi,ctrl.consultarDevoluciones,$scope);
      },
    };
    ctrl.consultarDevoluciones = function(offset,query){
        financieraMidRequest.get('devoluciones/GetAllDevolucionesTributarias',$.param({
          limit: ctrl.gridDevoluciones.paginationPageSize,
          offset:offset,
          query:query,
        })).then(function(response){
          if(response.data != null){
          ctrl.gridDevoluciones.data = response.data.Devolutions;
          ctrl.gridDevoluciones.totalItems = response.data.RegCuantity;
          console.log(ctrl.gridDevoluciones.data,"Cantidad registros ",response.data.RegCuantity," query ",query);
          }
        });
        };
      ctrl.consultarDevoluciones(0,'');

        ctrl.cargarEstados = function() {
            financieraRequest.get("estado_devolucion", $.param({
                    query:"Tipo:3",
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
                            from: 8,
                            to: 9
                        },
                        {
                            from: 8,
                            to: 10
                        },
                        {
                            from: 9,
                            to: 11
                        },
                        {
                            from: 9,
                            to: 12
                        }
                    ];
                });
        };

      ctrl.cargarEstados();
      $scope.loadrow = function(row, operacion) {
          $scope.devolucion = row.entity;
          switch (operacion) {
              case "proceso":
                  $scope.estado = $scope.devolucion.Estado;
                  break;
              case "ver":
                      ctrl.getAccountanInfo();
                      $("#modalDevolucion").modal();
                      break;
              default:
          }
      };

      ctrl.getAccountanInfo = function(){
        ctrl.movimientosAsociados=undefined;
        ctrl.conceptos = undefined;
        ctrl.devolucion = undefined;
        financieraMidRequest.get('devoluciones/GetTributaDevolutionAccountantInf/'+$scope.devolucion.Id).
        then(function(response){
          if (response.data != null) {
            ctrl.movimientosAsociados = response.data.MovimientosAsociados;
            ctrl.conceptos = response.data.Conceptos;
            ctrl.devolucion = $scope.devolucion;
          }
        });
      }
      $scope.funcion = function() {
          $scope.estadoclick = $localStorage.nodeclick;
          ctrl.Request = {
          EstadoDevolTribut:{
            EstadoDevolucion:$scope.estadoclick,
          },
            DevolucionTributaria:{
              Id:$scope.devolucion.Id
            }
          };
                financieraRequest.post('devolucion_tributaria_estado_devolucion/AddEstadoDevolTributaria', ctrl.Request).then(function(response) {
                  if(response.data.Type != undefined){
                    if(response.data.Type === "error"){
                        swal('',$translate.instant(response.data.Code),response.data.Type);
                      }else{
                        swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                          ctrl.consultarDevoluciones();
                          $scope.estado = undefined;
                        })
                      }
                    }
                  });
    }


  });
