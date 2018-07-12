'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesConsultaCtrl
 * @description
 * # InversionesConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesConsultaCtrl', function ($scope, financieraRequest, $localStorage, agoraRequest, $location, $translate, uiGridConstants, $window,ingresoDoc,coreRequest,administrativaRequest,$q) {

   var ctrl = this;

    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};
    $scope.senDataEstado.Usuario = {
      'Id': 1
    }

    $scope.botones = [
        //{ clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
        //{ clase_color: "ver", clase_css: "fa fa-check fa-lg faa-shake animated-hover", titulo: $translate.instant('LEGALIZAR'), operacion: 'legalizar', estado: true }

    ];

    ctrl.gridInversiones = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
              field: 'Id',
              displayName: 'Consecutivo',
              width: '5%',
          },
          {
              field: 'Vendedor.NombreBanco',
              displayName: 'Vendedor',
              width: '10%',
          },
          {
              field: 'Emisor.NombreBanco',
              displayName: 'Emisor',
              width: '10%',
          },
          {
              field: 'NumeroTransaccion',
              displayName: 'Numero Operación',
              width: '8%'
          },
          {
              field: 'Trm',
              displayName: 'TRM',
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '8%'
          },
          {
              field: 'TasaNominal',
              displayName: 'Tasa Nominal',
              width: '8%'
          },
          {
              field: 'ValorNominalSaldo',
              displayName: 'Valor Nom. Saldo',
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '8%',
          },
          {
              field: 'ValorNomSaldoMonNal',
              displayName: 'Valor Nom. Saldo Mon. Nal',
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '8%',
          },
          {
              field: 'ValorActual',
              displayName: 'Valor Actual',
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '8%',
          },
          {
              field: 'ValorNetoGirar',
              displayName: 'Valor Neto Girar',
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '8%',
          },
          {
              field: 'FechaCompra',
              displayName: 'Fecha Compra',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '7%',
          },
          {
              field: 'FechaRedencion',
              displayName: 'Fecha Redencion',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '7%',
          },
          {
              field: 'FechaVencimiento',
              displayName: 'Fecha Vencimiento',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '7%',
          },
          {
              field: 'Comprador.NomProveedor',
              displayName: 'Comprador',
              width: '8%',
          },
          {
              field: 'ValorRecompra',
              displayName: 'Valor Recompra',
              cellFilter: 'currency',
              cellClass: 'input_right',
              width: '8%',
          },
          {
              field: 'FechaPacto',
              displayName: 'Fecha Pacto',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '7%',
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '8%',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };

    ctrl.getInversiones = function() {
        financieraRequest.get("inversion", $.param({
                limit: -1,
                sortby: "Id",
                order: "asc"
            })).then(function(response) {
              angular.forEach(response.data, function(rowData) {
                var est = [];
                financieraRequest.get("inversion_estado_inversion", $.param({
                        query: "Inversion:" + rowData.Id + ",Activo:true",
                        fields: "Estado",
                        sortby: "FechaRegistro",
                        limit: -1,
                        order: "asc"
                    }))
                    .then(function(estado) {
                      angular.forEach(estado.data, function(rowData) {
                        est.push(rowData.Estado);
                      });
                      rowData.Estado = est;
                    });

                    coreRequest.get("banco", $.param({
                        query: "Id:" + rowData.Vendedor,
                        limit: -1
                      })).then(function(response) {
                        rowData.Vendedor = response.data[0];
                      });

                      coreRequest.get("banco", $.param({
                          query: "Id:" + rowData.Emisor,
                          limit: -1
                        })).then(function(response) {
                          rowData.Emisor = response.data[0];
                        });
                        administrativaRequest.get("informacion_persona_juridica", $.param({
                           	query: "Id:" + rowData.Comprador,
                            limit: -1
                          })).then(function(response) {
                            if(!angular.isUndefined(response)&& response.data != null){
                                rowData.Comprador = response.data[0];
                            }

                          });

              });

              ctrl.gridInversiones.data = response.data;
            });

          };

      ctrl.cargarEstados = function() {
          financieraRequest.get("estado_inversion", $.param({
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
                      },
                      {
                          from: 2,
                          to: 4
                      },
                      {
                          from: 2,
                          to: 5
                      },
                      {
                          from: 4,
                          to: 6
                      },
                      {
                          from: 4,
                          to: 7
                      }
                  ];
              });
      };


      ctrl.getInversiones();
      ctrl.cargarEstados();


      $scope.loadrow = function(row, operacion) {
          $scope.solicitud = row.entity;

          switch (operacion) {
              case "proceso":
                  $scope.estado = $scope.solicitud.Estado ;
                  break;
              default:
          }
      };
      ctrl.validateCancellation=function(){
        ctrl.servicioRespuesta=financieraRequest.get("cancelacion_inversion_estado_cancelacion/GetActiveCancelations", $.param({
                idInversion: $scope.solicitud.Id
            })).then(function(response){
              ctrl.respuestaValidateC=response.data.Body;
            })
      }

      $scope.funcion = function() {
          $scope.estadoclick = $localStorage.nodeclick;
          ctrl.Request = {
            Estado:$scope.estadoclick,
            EstadoPadre:$scope.solicitud.Estado[0],
            Inversion:{
              Id:$scope.solicitud.Id
            },
            Usuario:212121
          };
          if($scope.estadoclick.Id === 6 ||$scope.estadoclick.Id === 7 ){
            ctrl.validateCancellation();
            $q.all([ctrl.servicioRespuesta]).then(function(){
              if(!ctrl.respuestaValidateC){
                swal('',$translate.instant("E_CI001"),"error");
                return
              }
            });
          }

          if($scope.estadoclick.Id === 6){
          ingresoDoc.set(ctrl.Request);
          $scope.$apply(function(){
            $location.path('/inversiones/acta_compra');
          });
        }else if($scope.estadoclick.Id === 7){
          $scope.$apply(function(){
            $location.path('/inversiones/cancelacion/'+$scope.solicitud.Id);
          });
        }else{
                financieraRequest.post('inversion_estado_inversion/AddEstadoInv', ctrl.Request).then(function(response) {
                  if(response.data.Type != undefined){
                    if(response.data.Type === "error"){
                        swal('',$translate.instant(response.data.Code),response.data.Type);
                      }else{
                        swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                            ctrl.getInversiones();
                            $scope.estado=undefined;
                        })
                      }
                    }
                  });
                }
    }
  });
