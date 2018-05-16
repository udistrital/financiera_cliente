'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesConsultaDevolucionesTributariasCtrl
 * @description
 * # DevolucionesConsultaDevolucionesTributariasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesConsultaDevolucionesTributariasCtrl', function ($scope,$translate,financieraRequest,$localStorage) {
    var ctrl = this;

    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};

    $scope.botones = [
        { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
    ];
    ctrl.gridDevoluciones = {
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
              field: 'Devolucion.Id',
              displayName: $translate.instant('NUMERO_OPERACION'),
              width: '10%'
          },
          {
              field: 'Devolucion.FormaPago.Nombre',
              displayName: $translate.instant('FORMA_PAGO'),
              width: '15%',
          },
          {
              field: 'Devolucion.Oficio',
              displayName: $translate.instant('NO_OFICIO'),
              width: '13%'
          },
          {
              field: 'Devolucion.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '13%'
          },
          {
              field: 'Devolucion.UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              width: '13%'
          },
          {
              field: 'Devolucion.CuentaDevolucion.NumeroCuenta',
              displayName: $translate.instant('CUENTA'),
              width: '13%'
          },
          {
              field: 'Devolucion.Acta.Nombre',
              displayName: $translate.instant('ACTA'),
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
    ctrl.consultarDevoluciones = function(){
        financieraRequest.get('devolucion_tributaria_estado_devolucion',$.param({
          query:"Activo:true",
          limit: -1
        })).then(function(response){
          if(response.data != undefined){
            angular.forEach(response.data,function(row){
              financieraRequest.get('devolucion_tributaria_concepto',$.param({
                query:"DevolucionTributaria:" + row.Devolucion.Id,
                fields:"ValorDevolucion",
                limit: -1
              })).then(function(response){
                row.valorDevolucion = response.data[0].ValorDevolucion;
              });
            });
            ctrl.gridDevoluciones.data = response.data;
            console.log(ctrl.gridDevoluciones.data );
          }
        });
        };
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
      ctrl.consultarDevoluciones();
      $scope.loadrow = function(row, operacion) {
          $scope.devolucion = row.entity;
          console.log("fila seleccionada ",$scope.devolucion)
          switch (operacion) {
              case "proceso":
                  $scope.estado = $scope.devolucion.EstadoDevolucion;
                  break;
              case "otro":

                  break;
              default:
          }
      };

      $scope.funcion = function() {
          $scope.estadoclick = $localStorage.nodeclick;
          ctrl.Request = {
          EstadoDevolTribut:{
            EstadoDevolucion:$scope.estadoclick,
          },
            DevolucionTributaria:{
              Id:$scope.devolucion.Devolucion.Id
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
